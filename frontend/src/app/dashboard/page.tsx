"use client";
import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import Analytics from "../components/Analytics";

const Dashboard: React.FC = () => {
  const [models,setModels] = useState([]);
  const [filteredData, setFilteredData] = useState<
    { model: string; metrics: { [key: string]: number } }[]
  >([]);
  const [originalData, setOriginalData] = useState<
    { model: string; metrics: { [key: string]: number } }[]
  >([]);
  const metrics = [
    "Hallucination ",
    "Violence",
    "Self Harm",
    "Sexual",
    "Hate Unfairness",
    
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analytics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
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
        const transformedData: TransformedData[] = data.data.map((item: any) => {
          const calculatePercentages = (metric: MetricCounts): { [key: string]: number } => {
            const totalPrompt = item.promptCount;
            return Object.fromEntries(
              Object.entries(metric).map(([key, value]) => [
                key,
                parseFloat(((value / totalPrompt) * 100).toFixed(2)), // Calculate percentage and format
              ])
            );
          };
  
          return {
            model: item.modelName,
            metrics: {
              Hallucination: calculatePercentages(item.hallucinationCount),
              Violence: calculatePercentages(item.violenceMetricsCount),
              Sexual: calculatePercentages(item.sexualMetricsCount),
              SelfHarm: calculatePercentages(item.selfHarmMetricsCount),
              HateUnfairness: calculatePercentages(item.hateUnfairnessMetricsCount),
            },
          };
        });
  
        // Debugging Log
        console.log("Transformed Data:", transformedData);
  
        // Update States
        setModels(data.models);
        setOriginalData(transformedData); // Store original data
        setFilteredData(transformedData); // Initialize filtered data
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
      .map((item) => ({
        model: item.model,
        metrics: Object.fromEntries(
          Object.entries(item.metrics).filter(([metric]) =>
            selectedMetrics.includes(metric)
          )
        ),
      }));

    setFilteredData(filtered);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <FilterSidebar
        models={models}
        metrics={metrics}
        onApplyFilters={handleApplyFilters}
      />
      <div className="flex-grow overflow-y-auto">
        <Analytics data={filteredData} />
      </div>
    </div>
  );
};

export default Dashboard;
