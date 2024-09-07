import { useState } from "react";
import { UserGrowthChart } from "./Charts";
import { TrendingUp, Users, ArrowUpRight, BarChart2 } from "lucide-react";

const UserGrowth = () => {
  const [timeFrame, setTimeFrame] = useState("1y");

  const timeFrames = [
    { id: "1m", label: "1M" },
    { id: "6m", label: "6M" },
    { id: "1y", label: "1Y" },
    { id: "all", label: "ALL" },
  ];

  // Sample data for KPIs - replace with actual data
  const kpis = [
    { label: "Total Users", value: "11,500", change: "+15%", icon: Users },
    { label: "New Users (30d)", value: "2,500", change: "+8%", icon: ArrowUpRight },
    { label: "Avg. Daily Active", value: "7,200", change: "+12%", icon: BarChart2 },
  ];

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-white">
            User Growth
          </h2>
        </div>
        <div className="flex space-x-1">
          {timeFrames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setTimeFrame(frame.id)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                timeFrame === frame.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <kpi.icon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{kpi.label}</span>
              </div>
              <span className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-grow min-h-[300px]">
        <UserGrowthChart chartId="userGrowth" timeFrame={timeFrame} />
      </div>
    </div>
  );
};

export default UserGrowth;