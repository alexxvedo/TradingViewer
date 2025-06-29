//+------------------------------------------------------------------+
//|                                              TradingViewer.mq5 |
//|                                  Copyright 2024, Trading Viewer |
//|                                             https://example.com |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, Trading Viewer"
#property link      "https://example.com"
#property version   "1.00"

//--- Input parameters
input string ServerURL = "http://127.0.0.1:3001/api/data";
input int SendInterval = 5; // Send data every N seconds
input bool EnableDebug = true;

//--- Global variables
datetime lastSendTime = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
{
    Print("TradingViewer EA initialized for account: ", AccountInfoInteger(ACCOUNT_LOGIN));
    
    // Set timer for periodic data sending
    EventSetTimer(SendInterval);
    
    // Send initial data
    SendTradingData();
    
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    EventKillTimer();
    Print("TradingViewer EA deinitialized");
}

//+------------------------------------------------------------------+
//| Timer function                                                   |
//+------------------------------------------------------------------+
void OnTimer()
{
    SendTradingData();
}

//+------------------------------------------------------------------+
//| Send trading data to Electron app                               |
//+------------------------------------------------------------------+
void SendTradingData()
{
    // Get account information
    long login = AccountInfoInteger(ACCOUNT_LOGIN);
    double balance = AccountInfoDouble(ACCOUNT_BALANCE);
    double equity = AccountInfoDouble(ACCOUNT_EQUITY);
    double margin = AccountInfoDouble(ACCOUNT_MARGIN);
    double freeMargin = AccountInfoDouble(ACCOUNT_MARGIN_FREE);
    double marginLevel = AccountInfoDouble(ACCOUNT_MARGIN_LEVEL);
    
    // Calculate total profit from all positions
    double totalProfit = 0;
    int totalPositions = PositionsTotal();
    
    // Build positions array
    string positionsJson = "";
    
    for(int i = 0; i < totalPositions; i++)
    {
        if(PositionSelectByIndex(i))
        {
            long ticket = PositionGetInteger(POSITION_TICKET);
            string symbol = PositionGetString(POSITION_SYMBOL);
            long type = PositionGetInteger(POSITION_TYPE);
            double volume = PositionGetDouble(POSITION_VOLUME);
            double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
            double currentPrice = PositionGetDouble(POSITION_PRICE_CURRENT);
            double profit = PositionGetDouble(POSITION_PROFIT);
            double swap = PositionGetDouble(POSITION_SWAP);
            double commission = PositionGetDouble(POSITION_COMMISSION);
            datetime openTime = (datetime)PositionGetInteger(POSITION_TIME);
            
            totalProfit += profit + swap + commission;
            
            if(i > 0) positionsJson += ",";
            positionsJson += StringFormat(
                "{\"ticket\":%d,\"symbol\":\"%s\",\"type\":%d,\"volume\":%.2f,\"openPrice\":%.5f,\"currentPrice\":%.5f,\"profit\":%.2f,\"swap\":%.2f,\"commission\":%.2f,\"openTime\":%d}",
                ticket, symbol, type, volume, openPrice, currentPrice, profit, swap, commission, openTime
            );
        }
    }
    
    // Build JSON payload
    string jsonData = StringFormat(
        "{\"login\":\"%d\",\"balance\":%.2f,\"equity\":%.2f,\"margin\":%.2f,\"freeMargin\":%.2f,\"marginLevel\":%.2f,\"profit\":%.2f,\"positions\":[%s],\"timestamp\":%d}",
        login, balance, equity, margin, freeMargin, marginLevel, totalProfit, positionsJson, TimeLocal()
    );
    
    // Send HTTP request
    SendHttpRequest(jsonData);
    
    if(EnableDebug)
    {
        Print("Sent trading data for account: ", login, ", Balance: ", balance, ", Equity: ", equity, ", Positions: ", totalPositions);
    }
}

//+------------------------------------------------------------------+
//| Send HTTP POST request                                           |
//+------------------------------------------------------------------+
void SendHttpRequest(string jsonData)
{
    char postData[];
    char result[];
    string headers;
    
    // Convert JSON string to char array
    StringToCharArray(jsonData, postData, 0, StringLen(jsonData));
    
    // Set headers
    headers = "Content-Type: application/json\r\n";
    
    // Send HTTP request
    int timeout = 5000; // 5 seconds timeout
    int res = WebRequest(
        "POST",
        ServerURL,
        headers,
        timeout,
        postData,
        result,
        headers
    );
    
    if(res == -1)
    {
        int error = GetLastError();
        Print("WebRequest error: ", error, " - ", ErrorDescription(error));
        
        if(error == 4060)
        {
            Print("WebRequest not allowed. Add the URL to the list of allowed URLs in Tools -> Options -> Expert Advisors.");
        }
    }
    else if(EnableDebug)
    {
        Print("HTTP request sent successfully, response code: ", res);
    }
}

//+------------------------------------------------------------------+
//| Get error description                                            |
//+------------------------------------------------------------------+
string ErrorDescription(int errorCode)
{
    switch(errorCode)
    {
        case 4060: return "WebRequest not allowed";
        case 4014: return "Invalid URL";
        case 5203: return "HTTP request failed";
        default: return "Unknown error";
    }
} 