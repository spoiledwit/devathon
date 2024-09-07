import React, { useMemo } from "react";
import { TrendingUp, Users, UserCheck, DollarSign } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

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
  console.log(users);

  const kpis = useMemo(() => {
    const totalUsers = users.length;
    const totalRevenue = users.reduce((sum, user) => sum + user.revenue, 0);

    const roleDistribution = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        label: "Total Users",
        value: totalUsers.toLocaleString(),
        icon: Users,
      },
      {
        label: "Role Distribution",
        value: `${roleDistribution.agent || 0} / ${roleDistribution.user || 0} / ${roleDistribution.admin || 0}`,
        subtext: "Agent/User/Admin",
        icon: UserCheck,
      },
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        subtext: `$${totalUsers > 0 ? (totalRevenue / totalUsers).toFixed(2) : '0.00'} per user`,
        icon: DollarSign,
      },
    ];
  }, [users]);

  // New chartData for user growth using LineChart
  const chartData = useMemo(() => {
    const usersByMonth: Record<string, number> = {};

    users.forEach(user => {
      const createdAt = new Date(user.createdAt);
      if (!isNaN(createdAt.getTime())) { // Ensure date is valid
        const monthYear = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
        usersByMonth[monthYear] = (usersByMonth[monthYear] || 0) + 1;
      }
    });

    // Cumulative count for user growth
    let cumulativeCount = 0;
    return Object.entries(usersByMonth)
      .map(([monthYear, count]) => {
        cumulativeCount += count;
        return { monthYear, cumulativeCount };
      })
      .sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  }, [users]);

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 flex flex-col">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-medium text-gray-800 dark:text-white">
          User Growth Dashboard
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <kpi.icon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{kpi.value}</p>
            {kpi.subtext && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{kpi.subtext}</p>
            )}
          </div>
        ))}
      </div>
      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthYear" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cumulativeCount" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowth;
