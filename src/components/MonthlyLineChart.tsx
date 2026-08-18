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

const MonthlyLineChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const monthsFilter = 24;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}getdashboardnumbers?months=${monthsFilter}`
      );
      const payload = response.data.payload;

      if (Array.isArray(payload)) {
        setData(payload);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error loading dashboard data", error);
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
      {loading && (
        <div className="text-white text-center py-8">Loading...</div>
      )}
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            interval={0}
            minTickGap={0}
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
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
          <Line
            type="monotone"
            dataKey="enquiries"
            stroke="#f61a88"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyLineChart;
