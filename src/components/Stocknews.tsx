"use client";

import { useEffect } from "react";

const StockTicker = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        // 📊 Indian Indices
        { proName: "BSE:SENSEX", title: "Sensex" },
        { proName: "NSE:NIFTY", title: "Nifty 50" },
        { proName: "NSE:BANKNIFTY", title: "Bank Nifty" },

        // 🇮🇳 Indian Stocks
        { proName: "NSE:RELIANCE", title: "Reliance" },
        { proName: "NSE:TCS", title: "TCS" },
        { proName: "NSE:INFY", title: "Infosys" },
        { proName: "NSE:HDFCBANK", title: "HDFC Bank" },
        { proName: "NSE:ICICIBANK", title: "ICICI Bank" },
        { proName: "NSE:SBIN", title: "SBI" },
        { proName: "NSE:AXISBANK", title: "Axis Bank" },
        { proName: "NSE:KOTAKBANK", title: "Kotak Bank" },
        { proName: "NSE:WIPRO", title: "Wipro" },
        { proName: "NSE:HCLTECH", title: "HCL Tech" },
        { proName: "NSE:LT", title: "L&T" },
        { proName: "NSE:ITC", title: "ITC" },
        { proName: "NSE:ADANIENT", title: "Adani Ent." },
        { proName: "NSE:ADANIPORTS", title: "Adani Ports" },
        { proName: "NSE:BAJFINANCE", title: "Bajaj Finance" },
        { proName: "NSE:BAJAJ_AUTO", title: "Bajaj Auto" },
        { proName: "NSE:HINDUNILVR", title: "HUL" },
        { proName: "NSE:BHARTIARTL", title: "Airtel" },
        { proName: "NSE:MARUTI", title: "Maruti Suzuki" },
        { proName: "NSE:HEROMOTOCO", title: "Hero MotoCorp" },
        { proName: "NSE:TATAMOTORS", title: "Tata Motors" },
        { proName: "NSE:TATASTEEL", title: "Tata Steel" },
        { proName: "NSE:JSWSTEEL", title: "JSW Steel" },
        { proName: "NSE:ONGC", title: "ONGC" },
        { proName: "NSE:COALINDIA", title: "Coal India" },
        { proName: "NSE:BPCL", title: "BPCL" },
        { proName: "NSE:IOC", title: "IOC" },
        { proName: "NSE:POWERGRID", title: "Power Grid" },
        { proName: "NSE:NTPC", title: "NTPC" },
        { proName: "NSE:ULTRACEMCO", title: "Ultratech Cement" },
        { proName: "NSE:DRREDDY", title: "Dr Reddy's" },
        { proName: "NSE:SUNPHARMA", title: "Sun Pharma" },
        { proName: "NSE:CIPLA", title: "Cipla" },
        { proName: "NSE:DIVISLAB", title: "Divi's Labs" },
        { proName: "NSE:HAVELLS", title: "Havells" },
        { proName: "NSE:PIDILITIND", title: "Pidilite" },

        // 🌐 Global Tech & Indices
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:GOOGL", title: "Google" },
        { proName: "NASDAQ:MSFT", title: "Microsoft" },
        { proName: "NASDAQ:AMZN", title: "Amazon" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "NYSE:BRK.B", title: "Berkshire Hathaway" },
        { proName: "NYSE:JPM", title: "JP Morgan" },
        { proName: "NYSE:V", title: "Visa" },
        { proName: "NYSE:NKE", title: "Nike" },
        { proName: "NASDAQ:NVDA", title: "Nvidia" },
        { proName: "INDEX:SPX", title: "S&P 500" },
        { proName: "INDEX:DOWI", title: "Dow Jones" },
        { proName: "INDEX:NDX", title: "Nasdaq 100" },

        // 💱 Forex
        { proName: "FX_IDC:USDINR", title: "USD/INR" },
        { proName: "FX_IDC:EURINR", title: "EUR/INR" },
        { proName: "FX_IDC:JPYINR", title: "JPY/INR" },
        { proName: "FX_IDC:GBPINR", title: "GBP/INR" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "FX_IDC:USDJPY", title: "USD/JPY" },
        { proName: "FX_IDC:GBPUSD", title: "GBP/USD" },

        // 🪙 Crypto
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
        { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
        { proName: "BINANCE:BNBUSDT", title: "BNB" },
        { proName: "BINANCE:XRPUSDT", title: "Ripple" },
        { proName: "BINANCE:DOGEUSDT", title: "Dogecoin" }
      ],
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en"
    });

    const container = document.getElementById("tradingview-ticker-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full fixed top-0 z-[999] overflow-hidden border-b border-gray-700 bg-black">
      <div id="tradingview-ticker-container" className="tradingview-widget-container" />
    </div>
  );
};

export default StockTicker;
