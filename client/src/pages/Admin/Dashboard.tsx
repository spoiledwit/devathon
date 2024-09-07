import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  MessageSquare,
  ClipboardList,
  Briefcase,
  Loader
} from "lucide-react";
import axios from "axios";
import CountUp from "react-countup";
import { toast } from "react-hot-toast";
import AdminStats from "@/components/Admin/AdminStats";
import useAuthStore from "@/store/authStore";

const Dashboard = () => {

  const {user} = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    usersCount: 0,
    quotationsCount: 0,
    enquiriesCount: 0,
    conversationsCount: 0,
    jobsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  //@ts-ignore
  const userRole = user?.role;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userRole) return;

      setLoading(true);
      try {
        const endpoint = userRole === 'admin' ? `${import.meta.env.VITE_BASE_URI}/analytics/admin` : `${import.meta.env.VITE_BASE_URI}/analytics/agent`;
        const response = await axios.get(endpoint);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole]);

  const Widget = ({ icon: Icon, label, value, bgColor, iconColor, textColor }:{
    icon: any,
    label: string,
    value: number,
    bgColor: string,
    iconColor: string,
    textColor: string
  }) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm flex flex-col items-center`}>
      <div className={`${iconColor} rounded-full p-3 inline-block`}>
        <Icon className="text-white h-6 w-6" />
      </div>
      <p className={`${textColor} mt-5`}>{label}</p>
      <h3 className={`text-2xl font-medium mt-1 ${textColor}`}>
        <CountUp end={value} />
      </h3>
    </div>
  );

  const widgets = [
    {
      icon: Users,
      label: "Users",
      value: dashboardData.usersCount,
      textColor: "text-blue-500",
      bgColor: "bg-blue-400/20",
      iconColor: "bg-blue-500",
    },
    {
      icon: FileText,
      label: "Enquiries",
      value: dashboardData.enquiriesCount,
      textColor: "text-green-500",
      bgColor: "bg-green-400/20",
      iconColor: "bg-green-500",
    },
    {
      icon: ClipboardList,
      label: "Quotations",
      value: dashboardData.quotationsCount,
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-400/20",
      iconColor: "bg-yellow-500",
    },
    {
      icon: MessageSquare,
      label: "Conversations",
      value: dashboardData.conversationsCount,
      textColor: "text-pink-500",
      bgColor: "bg-pink-400/20",
      iconColor: "bg-pink-500",
    },
    {
      icon: Briefcase,
      label: "Jobs",
      value: dashboardData.jobsCount,
      textColor: "text-purple-500",
      bgColor: "bg-purple-400/20",
      iconColor: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-white bg-opacity-90 dark:bg-zinc-900 dark:bg-opacity-90">
        <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid mt-6 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {widgets.map((widget, index) => (
          <Widget key={index} {...widget} />
        ))}
      </div>
      {userRole === 'admin' && (
        <div className="mt-6">
          <AdminStats />
        </div>
      )}
    </div>
  );
};

export default Dashboard;