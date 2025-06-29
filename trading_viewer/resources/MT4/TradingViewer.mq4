//+------------------------------------------------------------------+
//|                                              TradingViewer.mq4 |
//|                                  Copyright 2024, Trading Viewer |
//|                                             https://example.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Trading Viewer"
#property link      "https://example.com"
#property version   "1.00"

//--- Input parameters
extern string ServerURL = "http://127.0.0.1:3001/api/data";
extern int SendInterval = 5; // Send data every N seconds
extern bool EnableDebug = true;

//--- Global variables
datetime lastSendTime = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int init()
{
    Print("TradingViewer EA initialized for account: ", AccountNumber());
    
    // Send initial data
    SendTradingData();
    
    return(0);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
int deinit()
{
    Print("TradingViewer EA deinitialized");
    return(0);
}

//+------------------------------------------------------------------+
//| Expert start function                                            |
//+------------------------------------------------------------------+
int start()
{
    // Check if it's time to send data
    if(TimeCurrent() - lastSendTime >= SendInterval)
    {
        SendTradingData();
        lastSendTime = TimeCurrent();
    }
    
    return(0);
}

//+------------------------------------------------------------------+
//| Send trading data to Electron app                               |
//+------------------------------------------------------------------+
void SendTradingData()
{
    // Get account information
    int login = AccountNumber();
    double balance = AccountBalance();
    double equity = AccountEquity();
    double margin = AccountMargin();
    double freeMargin = AccountFreeMargin();
    double marginLevel = AccountFreeMarginCheck(Symbol(), OP_BUY, 1.0);
    if(margin > 0) marginLevel = (equity / margin) * 100;
    else marginLevel = 0;
    
    // Calculate total profit from all orders
    double totalProfit = 0;
    int totalOrders = OrdersTotal();
    
    // Build positions array
    string positionsJson = "";
    int positionCount = 0;
    
    for(int i = 0; i < totalOrders; i++)
    {
        if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
        {
            if(OrderType() <= OP_SELL) // Only market orders (positions)
            {
                int ticket = OrderTicket();
                string symbol = OrderSymbol();
                int type = OrderType();
                double volume = OrderLots();
                double openPrice = OrderOpenPrice();
                double currentPrice = (type == OP_BUY) ? MarketInfo(symbol, MODE_BID) : MarketInfo(symbol, MODE_ASK);
                double profit = OrderProfit();
                double swap = OrderSwap();
                double commission = OrderCommission();
                datetime openTime = OrderOpenTime();
                
                totalProfit += profit + swap + commission;
                
                if(positionCount > 0) positionsJson = positionsJson + ",";
                positionsJson = positionsJson + StringConcatenate(
                    "{\"ticket\":", ticket,
                    ",\"symbol\":\"", symbol, "\"",
                    ",\"type\":", type,
                    ",\"volume\":", DoubleToStr(volume, 2),
                    ",\"openPrice\":", DoubleToStr(openPrice, 5),
                    ",\"currentPrice\":", DoubleToStr(currentPrice, 5),
                    ",\"profit\":", DoubleToStr(profit, 2),
                    ",\"swap\":", DoubleToStr(swap, 2),
                    ",\"commission\":", DoubleToStr(commission, 2),
                    ",\"openTime\":", openTime, "}"
                );
                positionCount++;
            }
        }
    }
    
    // Build JSON payload
    string jsonData = StringConcatenate(
        "{\"login\":\"", login, "\"",
        ",\"balance\":", DoubleToStr(balance, 2),
        ",\"equity\":", DoubleToStr(equity, 2),
        ",\"margin\":", DoubleToStr(margin, 2),
        ",\"freeMargin\":", DoubleToStr(freeMargin, 2),
        ",\"marginLevel\":", DoubleToStr(marginLevel, 2),
        ",\"profit\":", DoubleToStr(totalProfit, 2),
        ",\"positions\":[", positionsJson, "]",
        ",\"timestamp\":", TimeCurrent(), "}"
    );
    
    // Send HTTP request
    SendHttpRequest(jsonData);
    
    if(EnableDebug)
    {
        Print("Sent trading data for account: ", login, ", Balance: ", balance, ", Equity: ", equity, ", Positions: ", positionCount);
    }
}

//+------------------------------------------------------------------+
//| Send HTTP POST request using WinINet                            |
//+------------------------------------------------------------------+
void SendHttpRequest(string jsonData)
{
    // Import WinINet functions
    #import "wininet.dll"
    int InternetOpenW(string, int, string, string, int);
    int InternetConnectW(int, string, int, string, string, int, int, int);
    int HttpOpenRequestW(int, string, string, string, string, string, int, int);
    int HttpSendRequestW(int, string, int, string, int);
    bool HttpQueryInfoW(int, int, uchar&[], int&, int&);
    bool InternetReadFile(int, uchar&[], int, int&);
    bool InternetCloseHandle(int);
    #import
    
    string host = "127.0.0.1";
    int port = 3001;
    string path = "/api/data";
    
    // Open internet connection
    int hInternet = InternetOpenW("TradingViewer", 1, "", "", 0);
    if(hInternet == 0)
    {
        Print("Failed to open internet connection");
        return;
    }
    
    // Connect to server
    int hConnect = InternetConnectW(hInternet, host, port, "", "", 3, 0, 0);
    if(hConnect == 0)
    {
        Print("Failed to connect to server");
        InternetCloseHandle(hInternet);
        return;
    }
    
    // Open HTTP request
    int hRequest = HttpOpenRequestW(hConnect, "POST", path, "HTTP/1.1", "", "", 0x80000000, 0);
    if(hRequest == 0)
    {
        Print("Failed to open HTTP request");
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);
        return;
    }
    
    // Set headers
    string headers = "Content-Type: application/json\r\nContent-Length: " + StringLen(jsonData) + "\r\n";
    
    // Send request
    bool result = HttpSendRequestW(hRequest, headers, StringLen(headers), jsonData, StringLen(jsonData));
    
    if(result)
    {
        if(EnableDebug)
        {
            Print("HTTP request sent successfully");
        }
    }
    else
    {
        Print("Failed to send HTTP request");
    }
    
    // Clean up
    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);
} 