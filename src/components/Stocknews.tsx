"use client";

import { useEffect } from "react";

const StockTicker = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        // 📊 Indian Indices - Fixed format
        { proName: "BSE:SENSEX", title: "Sensex" },
        { proName: "BSE:POWER", title: "BSE Power" },
        { proName: "BSE:IT", title: "BSE IT" },

        // 🇮🇳 Indian Stocks - Sorted alphabetically by title
        { proName: "BSE:ADANIENT", title: "Adani Ent." },
        { proName: "BSE:ADANIPORTS", title: "Adani Ports" },
        { proName: "BSE:APOLLOHOSP", title: "Apollo Hospitals" },
        { proName: "BSE:ASIANPAINT", title: "Asian Paints" },
        { proName: "BSE:AXISBANK", title: "Axis Bank" },
        { proName: "BSE:BAJAJ_AUTO", title: "Bajaj Auto" },
        { proName: "BSE:BAJFINANCE", title: "Bajaj Finance" },
        { proName: "BSE:BAJAJFINSV", title: "Bajaj FiBSErv" },
        { proName: "BSE:BEL", title: "BEL" },
        { proName: "BSE:BHARTIARTL", title: "Bharti Airtel" },
        { proName: "BSE:CIPLA", title: "Cipla" },
        { proName: "BSE:COALINDIA", title: "Coal India" },
        { proName: "BSE:DRREDDY", title: "Dr Reddy's" },
        { proName: "BSE:EICHERMOT", title: "Eicher Motors" },
        { proName: "BSE:GRASIM", title: "Grasim" },
        { proName: "BSE:HCLTECH", title: "HCL Tech" },
        { proName: "BSE:HDFCBANK", title: "HDFC Bank" },
        { proName: "BSE:HDFCLIFE", title: "HDFC Life" },
        { proName: "BSE:HEROMOTOCO", title: "Hero MotoCorp" },
        { proName: "BSE:HINDALCO", title: "Hindalco" },
        { proName: "BSE:HINDUNILVR", title: "Hindustan Unilever" },
        { proName: "BSE:ICICIBANK", title: "ICICI Bank" },
        { proName: "BSE:INDUSINDBK", title: "IndusInd Bank" },
        { proName: "BSE:INFY", title: "Infosys" },
        { proName: "BSE:ITC", title: "ITC" },
        { proName: "BSE:JIOFIN", title: "Jio Financial" },
        { proName: "BSE:JSWSTEEL", title: "JSW Steel" },
        { proName: "BSE:KOTAKBANK", title: "Kotak Bank" },
        { proName: "BSE:LT", title: "L&T" },
        { proName: "BSE:MARUTI", title: "Maruti Suzuki" },
        { proName: "BSE:NESTLEIND", title: "Nestle India" },
        { proName: "BSE:NTPC", title: "NTPC" },
        { proName: "BSE:ONGC", title: "ONGC" },
        { proName: "BSE:POWERGRID", title: "Power Grid" },
        { proName: "BSE:RELIANCE", title: "Reliance" },
        { proName: "BSE:SBILIFE", title: "SBI Life" },
        { proName: "BSE:SBIN", title: "SBI" },
        { proName: "BSE:SHRIRAMFIN", title: "Shriram Finance" },
        { proName: "BSE:SUNPHARMA", title: "Sun Pharma" },
        { proName: "BSE:TATACONSUM", title: "Tata Consumer" },
        { proName: "BSE:TATAMOTORS", title: "Tata Motors" },
        { proName: "BSE:TATASTEEL", title: "Tata Steel" },
        { proName: "BSE:TCS", title: "TCS" },
        { proName: "BSE:TECHM", title: "Tech Mahindra" },
        { proName: "BSE:TITAN", title: "Titan" },
        { proName: "BSE:TRENT", title: "Trent" },
        { proName: "BSE:ULTRACEMCO", title: "Ultratech Cement" },
        { proName: "BSE:WIPRO", title: "Wipro" },

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
        { proName: "BINANCE:DOGEUSDT", title: "Dogecoin" },
      ],

      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    const container = document.getElementById("tradingview-ticker-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full z-[50] overflow-hidden border-gray-700">
      <div
        id="tradingview-ticker-container"
        className="tradingview-widget-container"
      />
      <div className="text-xs text-gray-400 text-center mt-0.5">
        All data is sourced from TradingView
      </div>
    </div>
  );
};

export default StockTicker;
