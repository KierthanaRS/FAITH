import React, { useState } from "react";

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

  return (
    <div className="p-4 bg-gray-800 text-white w-64">
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
        className="mt-6 bg-violet-500 p-2 w-full rounded"
        onClick={handleApply}
      >
        Apply
      </button>
    </div>
  );
};

export default FilterSidebar;
