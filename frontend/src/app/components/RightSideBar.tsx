import React from "react";

interface RightSidebarProps {
  modelName: string;
  stats: {
    totalPrompts: number;
    falsePositives: number;
    falseNegatives: number;
    hallucinationPercentage: number;
  };

  onDetailedAnalyticsClick: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  modelName,
  stats,

  onDetailedAnalyticsClick,
}) => {
  return (
    <div className="w-64 bg-sidebar text-white h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4 uppercase text-center">{modelName}</h2>
      <h3 className="text-lg font-bold text-gray-400 mb-5">Statistics</h3>

      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-violet-500">
          <h2 className="text-xl font-bold text-violet-500">Total Prompts</h2>
          <p className="text-sm text-gray-400">{stats.totalPrompts}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-green-500">False Positives</h2>
          <p className="text-sm text-gray-400">{stats.falsePositives}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-200">
            False Negatives
          </h2>
          <p className="text-sm text-gray-400">{stats.falseNegatives}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-pink-500">
          <h2 className="text-xl font-bold text-pink-500">Hallucination %</h2>
          <p className="text-sm text-gray-400">
            {stats.hallucinationPercentage}
          </p>
        </div>
      </div>
      <button
        className="mt-auto bg-gray-700 hover:bg-gray-800 text-white py-2 px-2 rounded-md mx-auto"
        onClick={onDetailedAnalyticsClick}
      >
        View Detailed Analytics
      </button>
    </div>
  );
};

export default RightSidebar;
