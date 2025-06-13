import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY; // Store in .env
  const symbols = [
    // Indian Nifty 50 stocks (sample, add more as needed)
    'RELIANCE.BO', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
    // Indian indices
    '^BSESN', '^NSEI', '^NSEBANK',
    // Foreign stocks
    'AAPL', 'TSLA', 'AMZN',
    // Foreign indices
    '^GSPC', '^IXIC', '^FTSE'
  ];

  const fetchStocks = async () => {
    try {
      const data = await Promise.all(symbols.map(async (symbol) => {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const response = await axios.get(url);
        const quote = response.data['Global Quote'];
        if (!quote) return null;
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']).toFixed(2),
          change: parseFloat(quote['09. change']).toFixed(2),
          changePercent: quote['10. change percent']
        };
      }));
      setStocks(data.filter(item => item !== null));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stocks:', err.message);
      setError('Failed to load stock data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {stocks.map((stock, index) => (
          <div key={index} className="mx-4 flex items-center">
            <span className="font-bold text-gray-800">{stock.symbol}</span>
            <span className="mx-2">${stock.price}</span>
            <span className={`mx-2 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change} ({stock.changePercent})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}