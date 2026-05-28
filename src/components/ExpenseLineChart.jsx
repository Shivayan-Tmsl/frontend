import React from "react";
import {
    AreaChart,
    ResponsiveContainer,
    Legend,
    Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Area
} from "recharts";

const ExpenseLineChart = ({ expenseData }) => {

    const data = expenseData?.map((item) => ({
        name: new Date(item.date).toLocaleDateString(),
        amount: item.amount,
    })) || [];

    return (
        <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart data={data} margin={{ right: 30 }}>

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
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
                <XAxis dataKey="name" interval="preserveStartEnd" />
                <YAxis />
                <Legend />
                <Tooltip />

                {/* Filled pastel area */}
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