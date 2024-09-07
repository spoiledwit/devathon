import React, { useState, useMemo } from "react";
import { TrendingUp, Users, UserCheck, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "agent";
  revenue: number;
  createdAt: string;
}

interface UserGrowthProps {
  users: User[];
}

const UserGrowth: React.FC<UserGrowthProps> = ({ users }) => {
  const [timeFrame, setTimeFrame] = useState("1y");
  
  const timeFrames = [
    { id: "1m", label: "1M", days: 30 },
    { id: "6m", label: "6M", days: 180 },
    { id: "1y", label: "1Y", days: 365 },
    { id: "all", label: "ALL", days: Infinity },
  ];

  const kpis = useMemo(() => {
    const now = new Date();
    const totalUsers = users.length;
    const totalRevenue = users.reduce((sum, user) => sum + user.revenue, 0);
    
    const roleDistribution = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const getGrowthRate = (days: number) => {
      const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const pastUsers = users.filter(user => new Date(user.createdAt) < pastDate).length;
      const newUsers = totalUsers - pastUsers;
      return pastUsers > 0 ? ((newUsers / pastUsers) * 100).toFixed(1) : '100';
    };

    return [
      { 
        label: "Total Users", 
        value: totalUsers.toLocaleString(), 
        change: `+${getGrowthRate(30)}%`, 
        icon: Users 
      },
      { 
        label: "Role Distribution", 
        value: `${roleDistribution.agent || 0} / ${roleDistribution.user || 0} / ${roleDistribution.admin || 0}`, 
        change: "Agent/User/Admin", 
        icon: UserCheck 
      },
      { 
        label: "Total Revenue", 
        value: `$${totalRevenue.toLocaleString()}`, 
        change: `$${totalUsers > 0 ? (totalRevenue / totalUsers).toFixed(2) : '0.00'} per user`, 
        icon: DollarSign 
      },
    ];
  }, [users]);

  const chartData = useMemo(() => {
    const now = new Date();
    const timeFrameDays = timeFrames.find(tf => tf.id === timeFrame)?.days || Infinity;
    const startDate = new Date(now.getTime() - timeFrameDays * 24 * 60 * 60 * 1000);
    
    const usersByMonth: Record<string, number> = {};
    users.forEach(user => {
      const createdAt = new Date(user.createdAt);
      if (createdAt >= startDate) {
        const monthYear = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        usersByMonth[monthYear] = (usersByMonth[monthYear] || 0) + 1;
      }
    });

    return Object.entries(usersByMonth)
      .map(([monthYear, count]) => ({ monthYear, count }))
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  }, [users, timeFrame]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
      <Users className="w-16 h-16 mb-4" />
      <p className="text-lg font-medium">No user data available for this time frame</p>
      <p className="text-sm">Try selecting a different time range or add more users</p>
    </div>
  );

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
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {kpi.change}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="flex-grow min-h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default UserGrowth;