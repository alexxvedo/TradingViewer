export interface AccountData {
  platform: "mt4" | "mt5";
  login: string;
  password: string;
  server: string;
  terminalPath: string;
  status?: "running" | "stopped";
}

export interface MTData {
  login: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  profit: number;
  positions: Position[];
  timestamp: number;
}

export interface Position {
  ticket: number;
  symbol: string;
  type: number;
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  swap: number;
  commission: number;
  openTime: number;
}

declare global {
  interface Window {
    electronAPI: {
      getAccounts: () => Promise<AccountData[]>;
      addAccount: (accountData: AccountData) => Promise<AccountData[]>;
      removeAccount: (
        platform: string,
        login: string
      ) => Promise<AccountData[]>;
      startAccount: (platform: string, login: string) => Promise<boolean>;
      stopAccount: (platform: string, login: string) => Promise<boolean>;
      onMTData: (callback: (data: MTData) => void) => void;
      removeMTDataListener: () => void;
    };
  }
}
