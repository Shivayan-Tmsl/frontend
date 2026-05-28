import React from "react";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis, ResponsiveContainer
} from "recharts";

const IncomeBarChartComponent = ({incomeData}) => {

    const getBarColor = (index) => {
        return index % 2 === 0 ? "#A8E6CF" : "#6FCF97"; // Alternate between two shades of green
    };
    
    const data = incomeData?.map((item, index) => ({
        name: new Date(item.date).toLocaleDateString(),
        amount: item.amount,
        fill: getBarColor(index)
    })) || [];

    return (
       < ResponsiveContainer width="100%" height={300}>
        <BarChart width={200} height={200} data={data}>
            <Bar dataKey="amount" fill="green" radius={[8,8,0,0]} />
            
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
        </BarChart>
        </ResponsiveContainer>
    );
};

export default IncomeBarChartComponent;
