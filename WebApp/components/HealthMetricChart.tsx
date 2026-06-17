import React from 'react';
import { HealthMetric } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthMetricChartProps {
  metric: HealthMetric;
}

const HealthMetricChart: React.FC<HealthMetricChartProps> = ({ metric }) => {
  // The module system now handles loading. If 'recharts' fails to load,
  // the browser's module loader will throw an error, or the component might not render.
  // We assume successful loading if the component renders.

  const data = metric.data.map(record => ({
    // Ensure timestamp is valid before calling toLocaleTimeString
    name: record.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    value: record.value,
  }));
  
  return (
    <div style={{ width: '100%', height: 250 }} className="bg-slate-50 p-2 rounded-md">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0, 
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis 
            tick={{ fontSize: 10, fill: '#64748b' }} 
            domain={['dataMin - 5', 'dataMax + 5']}
            allowDataOverflow={true}
            />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#334155' }}
            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={metric.name} 
            stroke="#0ea5e9" 
            strokeWidth={2} 
            activeDot={{ r: 6 }} 
            dot={{r:3, fill: '#0ea5e9'}} 
            isAnimationActive={true}
            />
          {metric.targetRange && (
            <>
              <Line 
                type="monotone" 
                dataKey={() => metric.targetRange?.min} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                name="Target Min" 
                dot={false} 
                isAnimationActive={false} 
              />
              <Line 
                type="monotone" 
                dataKey={() => metric.targetRange?.max} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                name="Target Max" 
                dot={false} 
                isAnimationActive={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthMetricChart;