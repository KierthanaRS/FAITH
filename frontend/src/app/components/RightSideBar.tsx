import React from "react";
import { useState,useEffect } from "react";
interface analyticsProps {
  modelName: string;
  promptCount: number;
  hallucinationCount: Record<string, number>;
  violenceMetricsCount: Record<string, number>;
  sexualMetricsCount: Record<string, number>;
  selfHarmMetricsCount: Record<string, number>;
  hateUnfairnessMetricsCount: Record<string, number>;
}
interface RightSidebarProps {
  modelName: string;
  analytics: analyticsProps[] | null;
  onDetailedAnalyticsClick: () => void;
  modelSelection: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  modelName,
  analytics,
  onDetailedAnalyticsClick,
  modelSelection,
}) => {
  const [stats, setStats] = useState<{
    totalPrompts: number | string;
    hallucinationPercentage: string;
    safePercentage: string;
    oppositeViolencePercentage: string;
  }>({
    totalPrompts: "No Data Available",
    hallucinationPercentage: "No Data Available",
    safePercentage: "No Data Available",
    oppositeViolencePercentage: "No Data Available",
  });
  const[model,setModel]=useState<string>("gpt-4o-mini");
  useEffect(() => {
    if (!analytics) {
      setStats({
        totalPrompts: "No Data Available",
        hallucinationPercentage: "No Data Available",
        safePercentage: "No Data Available",
        oppositeViolencePercentage: "No Data Available",
      });
      return;
    }
    if(modelName==="Use other model"){
      setModel(modelSelection);
    }
    else{
      setModel(modelName);
    }
    const modelData = analytics.find((data) => data.modelName === model);
    if (!modelData) {
      setStats({
        totalPrompts: "No Data Available",
        hallucinationPercentage: "No Data Available",
        safePercentage: "No Data Available",
        oppositeViolencePercentage: "No Data Available",
      });
      return;
    }

    const { promptCount, hallucinationCount, hateUnfairnessMetricsCount, violenceMetricsCount } =
      modelData;

    const hallucinationSum =
      hallucinationCount["1"] + hallucinationCount["2"] + hallucinationCount["3"];
    const safeSum =
      hateUnfairnessMetricsCount["Very low"] + hateUnfairnessMetricsCount["Low"];
    const oppositeViolenceSum =
      violenceMetricsCount["Very low"] + violenceMetricsCount["Low"];

    setStats({
      totalPrompts: promptCount || 0,
      hallucinationPercentage:
        promptCount > 0
          ? `${((hallucinationSum / promptCount) * 100).toFixed(2)}%`
          : "0%",
      safePercentage:
        promptCount > 0
          ? `${((safeSum / promptCount) * 100).toFixed(2)}%`
          : "0%",
      oppositeViolencePercentage:
        promptCount > 0
          ? `${((oppositeViolenceSum / promptCount) * 100).toFixed(2)}%`
          : "0%",
    });
  }, [modelName, modelSelection, analytics, model]);
  return (
    <div className="w-64 bg-sidebar text-white h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4 uppercase text-center">{model}</h2>
      <h3 className="text-lg font-bold text-gray-400 mb-5">Statistics</h3>

      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-violet-500 tracking-wider">
          <h2 className="text-xl font-bold text-violet-500">Total Prompts</h2>
          <p className="text-sm text-gray-400">{stats.totalPrompts}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-green-500 tracking-wider">
          <h2 className="text-xl font-bold text-green-500">Hallucination</h2>
          <p className="text-sm text-gray-400">{stats.hallucinationPercentage}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-yellow-200 tracking-wider">
          <h2 className="text-xl font-bold text-yellow-200">
            Safety
          </h2>
          <p className="text-sm text-gray-400">{stats.safePercentage}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl transform transition hover:scale-105 hover:shadow-2xl border-t-4 border-pink-500 tracking-wider">
          <h2 className="text-xl font-bold text-pink-500">Non Violent</h2>
          <p className="text-sm text-gray-400">
            {stats.oppositeViolencePercentage}
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
