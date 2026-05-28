import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis, ResponsiveContainer
} from "recharts";

const BarChartComponent = ({dashboardData}) => {

    const getBarColor = (index) => {
        return index % 2 === 0 ? "#A8E6CF" : "#6FCF97"; // Alternate between two shades of green
    };
    
    const data = dashboardData?.last60DaysExpenses.transactions.map((item, index) => ({
        name: new Date(item.date).toLocaleDateString(),
        amount: item.amount,
        fill: getBarColor(index)
    })) || [];

    return (
       < ResponsiveContainer width="100%" height={300}>
        <BarChart width={300} height={300} data={data}>
            <Bar dataKey="amount" fill="green" radius={[8,8,0,0]} />
            
            <XAxis dataKey="name" />
            <YAxis />
        </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
