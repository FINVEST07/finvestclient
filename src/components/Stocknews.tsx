"use client";

import { useEffect } from "react";

const StockTicker = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        // 📊 Indian Indices - Fixed format
        { proName: "BSE:SENSEX", title: "Sensex" },
        { proName: "BSE:BANKEX", title: "Bankex" }, // BSE's bank index
        { proName: "BSE:POWER", title: "BSE Power" },
        { proName: "BSE:IT", title: "BSE IT" },


        // 🇮🇳 Indian Stocks - Correct ticker tape format
        { proName: "RELIANCE", title: "Reliance" },
        { proName: "TCS", title: "TCS" },
        { proName: "INFY", title: "Infosys" },
        { proName: "HDFCBANK", title: "HDFC Bank" },
        { proName: "ICICIBANK", title: "ICICI Bank" },
        { proName: "SBIN", title: "SBI" },
        { proName: "AXISBANK", title: "Axis Bank" },
        { proName: "KOTAKBANK", title: "Kotak Bank" },
        { proName: "WIPRO", title: "Wipro" },
        { proName: "HCLTECH", title: "HCL Tech" },
        { proName: "LT", title: "L&T" },
        { proName: "ITC", title: "ITC" },
        { proName: "ADANIENT", title: "Adani Ent." },
        { proName: "ADANIPORTS", title: "Adani Ports" },
        { proName: "BAJFINANCE", title: "Bajaj Finance" },
        { proName: "BAJAJ-AUTO", title: "Bajaj Auto" },
        { proName: "HINDUNILVR", title: "HUL" },
        { proName: "BHARTIARTL", title: "Airtel" },
        { proName: "MARUTI", title: "Maruti Suzuki" },
        { proName: "HEROMOTOCO", title: "Hero MotoCorp" },
        { proName: "TATAMOTORS", title: "Tata Motors" },
        { proName: "TATASTEEL", title: "Tata Steel" },
        { proName: "JSWSTEEL", title: "JSW Steel" },
        { proName: "ONGC", title: "ONGC" },
        { proName: "COALINDIA", title: "Coal India" },
        { proName: "BPCL", title: "BPCL" },
        { proName: "IOC", title: "IOC" },
        { proName: "POWERGRID", title: "Power Grid" },
        { proName: "NTPC", title: "NTPC" },
        { proName: "ULTRACEMCO", title: "Ultratech Cement" },
        { proName: "DRREDDY", title: "Dr Reddy's" },
        { proName: "SUNPHARMA", title: "Sun Pharma" },
        { proName: "CIPLA", title: "Cipla" },
        { proName: "DIVISLAB", title: "Divi's Labs" },
        { proName: "HAVELLS", title: "Havells" },
        { proName: "PIDILITIND", title: "Pidilite" },

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
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:DJI", title: "Dow Jones" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },

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
    <div className="w-full  z-[50] overflow-hidden border-gray-700 ">
      <div id="tradingview-ticker-container" className="tradingview-widget-container" />
    </div>
  );
};

export default StockTicker;
