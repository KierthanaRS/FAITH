import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalyticsProps {
  data: {
    model: string;
    metrics: {
      [key: string]: number;
    };
  }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  return (
    <div className="relative w-full max-w-screen-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Detailed Analytics
      </h1>
      {data.length === 0 && (
        <div className="text-center text-gray-400">
          Select a model to view data
        </div>
      )}
      {data.map((item) => (
        <div key={item.model} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{item.model}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 text-black">
            {item.metrics && Object.keys(item.metrics).length === 0 ? (
              <div className="text-center text-gray-400">
                No metrics available
              </div>
            ) : (
              Object.entries(item.metrics).map(([metric, partitions]) => {
                return (
                  <div
                    key={metric}
                    className="bg-gray-400 p-4 rounded flex flex-col items-center justify-center"
                  >
                    <h3 className="text-xl mb-2 text-center text-black">
                      {metric}
                    </h3>
                    <div className="relative w-full h-48 sm:w-48 md:w-56 lg:w-64 align-middle justify-center">
                      <Pie
                        data={{
                          labels: Object.keys(partitions),
                          datasets: [
                            {
                              data: Object.values(partitions).map(Number),
                              backgroundColor: [
                                "red",
                                "blue",
                                "green",
                                "yellow",
                                "orange",
                                "pink",
                              ], // Custom colors
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            tooltip: {
                              callbacks: {
                                label: (tooltipItem) => {
                                  const label = `${tooltipItem.label}: ${
                                    tooltipItem.raw as number
                                  }%`;
                                  return label;
                                },
                              },
                            },
                            legend: {
                              align: "center",
                              labels: {
                                color: "#000000",
                                font: {
                                  size: 12,
                                  family: "Roboto",
                                  weight: 400,
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
