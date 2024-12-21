"use client";
import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import Analytics from "../components/Analytics";

const Dashboard: React.FC = () => {
  const [models, setModels] = useState([]);
  const [filteredData, setFilteredData] = useState<
    { model: string; metrics: { [key: string]: number } }[]
  >([]);
  const [originalData, setOriginalData] = useState<
    { model: string; metrics: { [key: string]: number } }[]
  >([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const metrics = [
    "Hallucination",
    "Violence",
    "SelfHarm",
    "Sexual",
    "HateUnfairness",
  ];
  useEffect(() => {
    const fetchData = async () => {
      const hallucinationMapping: { [key: number]: string } = {
        1: "Very High",
        2: "High",
        3: "Medium",
        4: "Low",
        5: "Very Low",
        6: "Intentional"
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics/`
        );

        const data = await response.json();

        interface MetricCounts {
          [key: string]: number;
        }

        interface TransformedData {
          model: string;
          metrics: {
            Hallucination: number;
            Violence: number;
            Sexual: number;
            SelfHarm: number;
            HateUnfairness: number;
          };
        }

        // Transformation Logic
        const transformedData: TransformedData[] = data.data.map(
          (item: any) => {
            const calculatePercentages = (
              metric: MetricCounts
            ): { [key: string]: number } => {
              const totalPrompt = item.promptCount;
              const getKeyMapping = (key: string): string => {
                if (!isNaN(Number(key)) && key.trim() !== "") {
                  const num = Number(key);
                  if (num >= 1 && num <= 7) {
                    const mapping = hallucinationMapping[num];
                    return mapping;
                  }
                }
                return key;
              }
              const prompts = Object.fromEntries(
                Object.entries(metric).map(([key, value]) => {
                  return [
                    getKeyMapping(key),
                    parseFloat(((value / totalPrompt) * 100).toFixed(2)), // Calculate percentage and format
                  ];
                })
              );
              return prompts;
            };

            return {
              model: item.modelName,
              metrics: {
                Hallucination: calculatePercentages(item.hallucinationCount),
                Violence: calculatePercentages(item.violenceMetricsCount),
                Sexual: calculatePercentages(item.sexualMetricsCount),
                SelfHarm: calculatePercentages(item.selfHarmMetricsCount),
                HateUnfairness: calculatePercentages(
                  item.hateUnfairnessMetricsCount
                ),
              },
            };
          }
        );

        // Update States
        setModels(data.models);
        setOriginalData(transformedData);
        setFilteredData(transformedData);
        setSelectedModels(data.models);
        setSelectedMetrics(metrics);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleApplyFilters = (
    selectedModels: string[],
    selectedMetrics: string[]
  ) => {
    const filtered = originalData
      .filter((item) => selectedModels.includes(item.model))
      .map((item) => {
        const filteredMetrics = Object.entries(item.metrics)
          .filter(([metric]) => selectedMetrics.includes(metric))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {} as { [key: string]: number });
        return {
          model: item.model,
          metrics: filteredMetrics,
        };
      })

      .filter((item) => Object.keys(item.metrics).length > 0);

    setFilteredData(filtered);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <FilterSidebar
        models={models}
        metrics={metrics}
        onApplyFilters={handleApplyFilters}
        selectedModels={selectedModels}
        selectedMetrics={selectedMetrics}
        setSelectedModels={setSelectedModels}
        setSelectedMetrics={setSelectedMetrics}
      />
      <div className="flex-grow overflow-y-auto">
        <Analytics data={filteredData} />
      </div>
    </div>
  );
};

export default Dashboard;
