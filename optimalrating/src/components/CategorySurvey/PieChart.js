import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';

export default ({ data }) => {
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="percent" nameKey="choice_title" data={data.map(x => ({ ...x, percent: parseFloat(x.percent) }))} fill="#8884d8">
            {data.map((item, i) => (
              <Cell key={`cell-${i}`} fill={item.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};