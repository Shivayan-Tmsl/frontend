import React, { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import { ResponsiveContainer } from 'recharts';

const PieChartComponent = ({ dashboardData }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const data = [
        { name: 'Total Income', value: dashboardData?.totalIncome || 0 },
        { name: 'Total Expense', value: dashboardData?.totalExpense || 0 },
        { name: 'Total Balance', value: dashboardData?.totalBalance || 0 },

    ];

    const COLORS = ['#10B981', '#34D399', '#047857'];

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <ResponsiveContainer width="100%" height={300} >
        <PieChart margin={{top: 0, right: 0, bottom: 3, left: 0}} >
            <Pie
                activeIndex={activeIndex}
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius= "90%"
                innerRadius= "70%"
                fill="green"
                onMouseEnter={onPieEnter}
                style={{ cursor: 'pointer', outline: 'none' }} // Ensure no outline on focus
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <text x="50%" y="45%" textAnchor="middle" fontSize="14" fill="#6B7280">
                Total Balance
            </text>
            <text x="50%" y="55%" textAnchor="middle" fontSize="18" fontWeight="bold">
            ₹{dashboardData?.totalBalance || 0}
            </text>
            <Legend verticalAlign='bottom' height={36} wrapperStyle={{paddingTop: "14px"}}></Legend>
            <Tooltip />
        </PieChart>
        </ResponsiveContainer>
    );
}

export default PieChartComponent;