"use client";
import React, { useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import Analytics from "../components/Analytics";

const Dashboard: React.FC = () => {
  const models = ["GPT-4", "GPT-3.5", "GPT-3"];
  const metrics = [
    "Hallucination %",
    "Similarity",
    "Relevance",
    "Fluency",
    "F1Score",
    "Violence",
    "Bias",
    "SelfHarm",
    "HateUnfairness",
    "ContentSafety",
  ];

  const [filteredData, setFilteredData] = useState<
    { model: string; metrics: { [key: string]: number } }[]
  >([
    {
      model: "GPT-4",
      metrics: {
        "Hallucination %": 20,
        Similarity: 85,
        Relevance: 70,
        Fluency: 90,
        F1Score: 80,
        Violence: 20,
        Bias: 10,
        SelfHarm: 10,
        HateUnfairness: 10,
        ContentSafety: 10,
      },
    },
    {
      model: "GPT-3.5",
      metrics: {
        "Hallucination %": 25,
        Similarity: 80,
        Relevance: 65,
        Fluency: 85,
        F1Score: 80,
        Violence: 20,
        Bias: 10,
        SelfHarm: 10,
        HateUnfairness: 10,
        ContentSafety: 10,
      },
    },
    {
      model: "GPT-3",
      metrics: {
        "Hallucination %": 25,
        Similarity: 80,
        Relevance: 65,
        Fluency: 85,
        F1Score: 80,
        Violence: 20,
        Bias: 10,
        SelfHarm: 10,
        HateUnfairness: 10,
        ContentSafety: 10,
      },
    },
  ]);

  const handleApplyFilters = (
    selectedModels: string[],
    selectedMetrics: string[]

  ) => {
    const originalData = [
      {
        model: "GPT-4",
        metrics: {
          "Hallucination %": 20,
          Similarity: 85,
          Relevance: 70,
          Fluency: 90,
          F1Score: 80,
          Violence: 20,
          Bias: 10,
          SelfHarm: 10,
          HateUnfairness: 10,
          ContentSafety: 10,
        },
      },
      {
        model: "GPT-3.5",
        metrics: {
          "Hallucination %": 25,
          Similarity: 80,
          Relevance: 65,
          Fluency: 85,
          F1Score: 80,
          Violence: 20,
          Bias: 10,
          SelfHarm: 10,
          HateUnfairness: 10,
          ContentSafety: 10,
        },
      },
      {
        model: "GPT-3",
        metrics: {
          "Hallucination %": 25,
          Similarity: 80,
          Relevance: 65,
          Fluency: 85,
          F1Score: 80,
          Violence: 20,
          Bias: 10,
          SelfHarm: 10,
          HateUnfairness: 10,
          ContentSafety: 10,
        },
      },
    ];

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
