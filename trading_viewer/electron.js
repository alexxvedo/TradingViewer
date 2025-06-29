const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const express = require("express");
const bodyParser = require("body-parser");
// Initialize electron-store with dynamic import fallback
let store;
try {
  const Store = require("electron-store");
  store = new Store();
} catch (error) {
  // Fallback to simple JSON file storage
  const path = require("path");
  const fs = require("fs");
  const { app } = require("electron");

  const storePath = path.join(app.getPath("userData"), "config.json");

  store = {
    get: (key, defaultValue) => {
      try {
        const data = JSON.parse(fs.readFileSync(storePath, "utf8"));
        return data[key] !== undefined ? data[key] : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        let data = {};
        try {
          data = JSON.parse(fs.readFileSync(storePath, "utf8"));
        } catch {}
        data[key] = value;
        fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Failed to save config:", error);
      }
    },
  };
}

// Global variables
let mainWindow;
let expressServer;
const runningAccounts = new Map(); // Store running MT processes

// Express server setup
function createExpressServer() {
  const app = express();
  app.use(bodyParser.json());

  app.post("/api/data", (req, res) => {
    console.log("Received MT data:", req.body);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("mt-data", req.body);
    }
    res.sendStatus(200);
  });

  const server = app.listen(3001, "127.0.0.1", () => {
    console.log("Express server running on http://127.0.0.1:3001");
  });

  return server;
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "public", "icon.png"),
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("Loading development URL: http://localhost:3000");
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();

    // Add error handling
    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Failed to load:", errorCode, errorDescription);
      }
    );

    mainWindow.webContents.on("did-finish-load", () => {
      console.log("Page loaded successfully");
    });
  } else {
    console.log(
      "Loading production file:",
      path.join(__dirname, "out/index.html")
    );
    mainWindow.loadFile(path.join(__dirname, "out/index.html"));
  }

  // Show window when ready to prevent white screen
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Focus the window
    if (mainWindow) {
      mainWindow.focus();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// MT Terminal management functions
function createTempDirectory(platform, login) {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `${platform}_${login}_`)
  );

  // Create MQL directories
  const mqlDir = path.join(tempDir, platform === "mt5" ? "MQL5" : "MQL4");
  const expertsDir = path.join(mqlDir, "Experts");
  const profilesDir = path.join(tempDir, "Profiles");

  fs.mkdirSync(mqlDir, { recursive: true });
  fs.mkdirSync(expertsDir, { recursive: true });
  fs.mkdirSync(profilesDir, { recursive: true });

  return { tempDir, mqlDir, expertsDir, profilesDir };
}

function copyEAFiles(platform, expertsDir, profilesDir) {
  const resourcesPath = path.join(__dirname, "resources");
  const platformDir = path.join(resourcesPath, platform.toUpperCase());

  // Copy EA files
  const eaExtension = platform === "mt5" ? ".ex5" : ".ex4";
  const eaSource = path.join(platformDir, `TradingViewer${eaExtension}`);
  const eaTarget = path.join(expertsDir, `TradingViewer${eaExtension}`);

  if (fs.existsSync(eaSource)) {
    fs.copyFileSync(eaSource, eaTarget);
  }

  // Copy profile for MT5
  if (platform === "mt5") {
    const profileSource = path.join(platformDir, "EAProfile.tpl");
    const profileTarget = path.join(profilesDir, "Templates", "EAProfile.tpl");

    if (fs.existsSync(profileSource)) {
      fs.mkdirSync(path.dirname(profileTarget), { recursive: true });
      fs.copyFileSync(profileSource, profileTarget);
    }
  }
}

function createCommonIni(tempDir) {
  const iniContent = `[Common]
Login=
Password=
Server=
ProxyEnable=false
ProxyType=4
ProxyAddress=
ProxyPort=8080
ProxyLogin=
ProxyPassword=
CertInstall=true
NewsEnable=true
MaxBars=65000
PrintColorEnable=false
SaveDeleted=false
EnableDDE=false
EnableSound=true
ExpertsDllImport=true
ExpertsGlobalVars=true
ExpertsTrades=true
ExpertsHTTP=true
ExpertsModify=true
ExpertsRemove=true
Language=English
TemplatesDirectory=templates
LogsDirectory=logs
WebRequest=http://127.0.0.1:3001/*
`;

  const iniPath = path.join(tempDir, "common.ini");
  fs.writeFileSync(iniPath, iniContent);
  return iniPath;
}

function startMTTerminal(accountData) {
  const { platform, login, password, server, terminalPath } = accountData;

  try {
    // Create temporary directory structure
    const { tempDir, expertsDir, profilesDir } = createTempDirectory(
      platform,
      login
    );

    // Copy EA files and profiles
    copyEAFiles(platform, expertsDir, profilesDir);

    // Create common.ini
    const iniPath = createCommonIni(tempDir);

    // Build spawn arguments
    const args = [
      "/portable",
      `/config:${iniPath}`,
      `/login:${login}`,
      `/password:${password}`,
      `/server:${server}`,
    ];

    if (platform === "mt5") {
      args.push("/profile:EAProfile");
    }

    // Start MT terminal
    const mtProcess = spawn(terminalPath, args, {
      cwd: tempDir,
      windowsHide: true,
      stdio: "ignore",
    });

    const accountKey = `${platform}_${login}`;
    runningAccounts.set(accountKey, {
      process: mtProcess,
      tempDir,
      accountData,
    });

    mtProcess.on("exit", (code) => {
      console.log(`MT terminal ${accountKey} exited with code ${code}`);
      cleanupAccount(accountKey);
    });

    mtProcess.on("error", (error) => {
      console.error(`Error starting MT terminal ${accountKey}:`, error);
      cleanupAccount(accountKey);
    });

    return true;
  } catch (error) {
    console.error("Error starting MT terminal:", error);
    return false;
  }
}

function stopMTTerminal(platform, login) {
  const accountKey = `${platform}_${login}`;
  const accountInfo = runningAccounts.get(accountKey);

  if (accountInfo) {
    try {
      accountInfo.process.kill();
      cleanupAccount(accountKey);
      return true;
    } catch (error) {
      console.error("Error stopping MT terminal:", error);
      return false;
    }
  }

  return false;
}

function cleanupAccount(accountKey) {
  const accountInfo = runningAccounts.get(accountKey);
  if (accountInfo && accountInfo.tempDir) {
    try {
      fs.rmSync(accountInfo.tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error("Error cleaning up temp directory:", error);
    }
  }
  runningAccounts.delete(accountKey);
}

// IPC handlers
ipcMain.handle("get-accounts", () => {
  return store.get("accounts", []);
});

ipcMain.handle("add-account", (event, accountData) => {
  const accounts = store.get("accounts", []);
  const accountKey = `${accountData.platform}_${accountData.login}`;

  // Check if account already exists
  const existingIndex = accounts.findIndex(
    (acc) =>
      acc.platform === accountData.platform && acc.login === accountData.login
  );

  if (existingIndex >= 0) {
    accounts[existingIndex] = { ...accountData, status: "stopped" };
  } else {
    accounts.push({ ...accountData, status: "stopped" });
  }

  store.set("accounts", accounts);
  return accounts;
});

ipcMain.handle("remove-account", (event, platform, login) => {
  // Stop the terminal if running
  stopMTTerminal(platform, login);

  // Remove from store
  const accounts = store.get("accounts", []);
  const filteredAccounts = accounts.filter(
    (acc) => !(acc.platform === platform && acc.login === login)
  );

  store.set("accounts", filteredAccounts);
  return filteredAccounts;
});

ipcMain.handle("start-account", (event, platform, login) => {
  const accounts = store.get("accounts", []);
  const account = accounts.find(
    (acc) => acc.platform === platform && acc.login === login
  );

  if (account) {
    const success = startMTTerminal(account);
    if (success) {
      account.status = "running";
      store.set("accounts", accounts);
    }
    return success;
  }

  return false;
});

ipcMain.handle("stop-account", (event, platform, login) => {
  const success = stopMTTerminal(platform, login);
  if (success) {
    const accounts = store.get("accounts", []);
    const account = accounts.find(
      (acc) => acc.platform === platform && acc.login === login
    );
    if (account) {
      account.status = "stopped";
      store.set("accounts", accounts);
    }
  }
  return success;
});

// Disable GPU acceleration on Linux to fix rendering issues
if (process.platform === "linux") {
  app.disableHardwareAcceleration();
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  expressServer = createExpressServer();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // Stop all running MT terminals
  for (const [accountKey, accountInfo] of runningAccounts) {
    try {
      accountInfo.process.kill();
      cleanupAccount(accountKey);
    } catch (error) {
      console.error("Error stopping MT terminal on exit:", error);
    }
  }

  // Close express server
  if (expressServer) {
    expressServer.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  // Cleanup all running processes
  for (const [accountKey] of runningAccounts) {
    cleanupAccount(accountKey);
  }
});
