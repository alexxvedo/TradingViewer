"use client";

import { MTData } from "@/types/electron";

interface TradingDashboardProps {
  mtData: MTData[];
}

export default function TradingDashboard({ mtData }: TradingDashboardProps) {
  if (mtData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-lg">No trading data available</p>
        <p className="text-sm mt-2">
          Start an account to see real-time trading information
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getPositionTypeText = (type: number) => {
    return type === 0 ? "BUY" : "SELL";
  };

  const getPositionTypeColor = (type: number) => {
    return type === 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return "text-green-600 dark:text-green-400";
    if (profit < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {mtData.map((accountData) => (
        <div
          key={accountData.login}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account #{accountData.login}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last update: {formatDateTime(accountData.timestamp)}
            </span>
          </div>

          {/* Account Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Balance
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(accountData.balance)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Equity
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(accountData.equity)}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Free Margin
              </p>
              <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(accountData.freeMargin)}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                accountData.profit >= 0
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  accountData.profit >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                Total P/L
              </p>
              <p
                className={`text-xl font-bold ${
                  accountData.profit >= 0
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {formatCurrency(accountData.profit)}
              </p>
            </div>
          </div>

          {/* Positions Table */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Open Positions ({accountData.positions.length})
            </h4>

            {accountData.positions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No open positions
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Open Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {accountData.positions.map((position) => (
                      <tr key={position.ticket}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          #{position.ticket}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {position.symbol}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`font-medium ${getPositionTypeColor(
                              position.type
                            )}`}
                          >
                            {getPositionTypeText(position.type)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {position.volume.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {position.openPrice.toFixed(5)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {position.currentPrice.toFixed(5)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`font-medium ${getProfitColor(
                              position.profit
                            )}`}
                          >
                            {formatCurrency(position.profit)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
