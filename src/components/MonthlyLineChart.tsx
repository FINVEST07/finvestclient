import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";
import { useState, useCallback, useEffect } from "react";

// Define month order for Financial Year (April to March)
const financialYearOrder = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

// Sort data in financial year order
const sortDataFinancialYear = (data) => {
  return [...data].sort(
    (a, b) =>
      financialYearOrder.indexOf(a.month) - financialYearOrder.indexOf(b.month)
  );
};

const MonthlyLineChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getdashboardnumbers`
      );
      const payload = response.data.payload;

      if (Array.isArray(payload)) {
        const sortedData = sortDataFinancialYear(payload);
        setData(sortedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error loading users", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#82ca9d"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="#ffc658"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyLineChart;
