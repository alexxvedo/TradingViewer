"use client";

import { AccountData } from "@/types/electron";

interface AccountListProps {
  accounts: AccountData[];
  onRemoveAccount: (platform: string, login: string) => void;
  onStartAccount: (platform: string, login: string) => void;
  onStopAccount: (platform: string, login: string) => void;
}

export default function AccountList({
  accounts,
  onRemoveAccount,
  onStartAccount,
  onStopAccount,
}: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No accounts added yet.</p>
        <p className="text-sm mt-2">Add your first MT4/MT5 account above.</p>
      </div>
    );
  }

  const handleToggleAccount = (account: AccountData) => {
    if (account.status === "running") {
      onStopAccount(account.platform, account.login);
    } else {
      onStartAccount(account.platform, account.login);
    }
  };

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={`${account.platform}_${account.login}`}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {account.platform.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                #{account.login}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.status === "running"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                }`}
              >
                {account.status === "running" ? "Running" : "Stopped"}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            <p>
              <strong>Server:</strong> {account.server}
            </p>
            <p>
              <strong>Terminal:</strong> {account.terminalPath}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleToggleAccount(account)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                account.status === "running"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {account.status === "running" ? "Stop" : "Start"}
            </button>
            <button
              onClick={() => onRemoveAccount(account.platform, account.login)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
