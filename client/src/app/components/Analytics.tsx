import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsProps {
  data: {
    model: string;
    metrics: { [key: string]: number }; // Metric: Value
  }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  return (
    <div className="relative w-full max-w-screen-lg mx-auto p-4">
    {data.map((item) => (
      <div key={item.model} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{item.model}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 gap-6">
          {Object.entries(item.metrics).map(([metric, value]) => (
            <div
              key={metric}
              className="bg-gray-800 p-4 rounded flex items-center justify-center"
            >
              <h3 className="text-lg font-serif mb-2 text-center">{metric}</h3>
              <div className="relative w-48 h-48">
                <Pie
                  data={{
                    labels: [metric, "Other"],
                    datasets: [
                      {
                        data: [value, 100 - value],
                        backgroundColor: ["#8B5CF6", "#E5E7EB"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  
  );
};

export default Analytics;
