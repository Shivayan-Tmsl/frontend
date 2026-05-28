import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    AreaChart,
    ResponsiveContainer,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Area
} from "recharts";

const ExpenseLineChart = () => {

    const [chartData, setChartData] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {

        const fetchChartData = async () => {
            try {

                const response = await axios.get(
                    'http://localhost:8000/api/v1/line-chart/line-chart-data',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const { monthlyExpense, prediction } = response.data;

                console.log(monthlyExpense, prediction);

                // convert object into array
                const data = Object.entries(monthlyExpense).map(
                    ([month, amount]) => ({
                        name: month,
                        amount: amount
                    })
                );

                // add predicted month
                data.push({
                    name: "Predicted",
                    amount: prediction
                });

                setChartData(data);

            } catch (error) {
                console.error("Error fetching line chart data:", error);
            }
        };

        fetchChartData();

    }, []);

    return (
        <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart data={chartData} margin={{ right: 30 }}>

                <defs>
                    <linearGradient
                        id="greenGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#4CAF50"
                            stopOpacity={0.4}
                        />

                        <stop
                            offset="95%"
                            stopColor="#A8E6A3"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>

                <CartesianGrid />

                <XAxis dataKey="name" />

                <YAxis />

                <Legend />

                <Tooltip />

                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#1B5E20"
                    strokeWidth={3}
                    fill="url(#greenGradient)"
                    activeDot={{ r: 8 }}
                />

            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ExpenseLineChart;