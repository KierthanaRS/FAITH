import React, { useState,useEffect } from "react";

interface FilterSidebarProps {
  models: string[];
  metrics: string[];
  onApplyFilters: (selectedModels: string[], selectedMetrics: string[]) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  models,
  metrics,
  onApplyFilters,
}) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  useEffect(()=>{
    setSelectedModels(models); 
    setSelectedMetrics(metrics); 
  },[models,metrics]);

  

  const handleModelChange = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const handleApply = () => {
    onApplyFilters(selectedModels, selectedMetrics);
  };

  const handleClear = () => {
    setSelectedModels([]); 
    setSelectedMetrics([]); 
    onApplyFilters([], []);
  };
  return (
    <div className="p-4 bg-sidebar text-white w-64">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div>
        <h3 className="font-semibold mb-2">Models</h3>
        {models.map((model) => (
          <label key={model} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => handleModelChange(model)}
              checked={selectedModels.includes(model)}
            />
            {model}
          </label>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Metrics</h3>
        {metrics.map((metric) => (
          <label key={metric} className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => handleMetricChange(metric)}
              checked={selectedMetrics.includes(metric)}
            />
            {metric}
          </label>
        ))}
      </div>
      <button
        className="mt-6 bg-violet-500 p-2 w-full rounded hover:bg-violet-700"
        onClick={handleApply}
      >
        Apply
      </button>
      <button
        className="mt-6 bg-pink-500 p-2 w-full rounded hover:bg-pink-600"
        onClick={handleClear}
      >
        Clear Filter
      </button>

    </div>
  );
};

export default FilterSidebar;
