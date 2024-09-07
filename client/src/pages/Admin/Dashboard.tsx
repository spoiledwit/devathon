import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  Ticket,
  Calendar,
  UserPlus,
  Loader,
} from "lucide-react";
import axios from "axios";
import CountUp from "react-countup";
import { toast } from "react-hot-toast";
import AdminStats from "@/components/Admin/AdminStats";
import useAuthStore from "@/store/authStore";
import AgentDashboardGraphs from "@/components/Agent/AgentGraph";

interface DashboardData {
  users: any[];
  payments: any[];
  tickets: any[];
  events: any[];
  newUsers: any[];
}

interface AgentDashboardData {
  payments: any[];
  tickets: any[];
  events: any[];
}

const Dashboard = () => {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: [],
    payments: [],
    tickets: [],
    events: [],
    newUsers: [],
  });

  const [agentDashboardData, setAgentDashboardData] =
    useState<AgentDashboardData>({
      payments: [],
      tickets: [],
      events: [],
    });

  const [loading, setLoading] = useState(true);

  const userRole = user?.role;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userRole) return;
      setLoading(true);
      try {
        const endpoint = `${
          import.meta.env.VITE_BASE_URI
        }/analytics/${userRole}`;
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (userRole === "admin") {
          setDashboardData(response.data);
        } else {
          setAgentDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole]);

  const Widget = ({
    icon: Icon,
    label,
    value,
    bgColor,
    iconColor,
    textColor,
  }: {
    icon: any;
    label: string;
    value: number;
    bgColor: string;
    iconColor: string;
    textColor: string;
  }) => (
    <div
      className={`${bgColor} p-6 rounded-lg shadow-sm flex flex-col items-center`}
    >
      <div className={`${iconColor} rounded-full p-3 inline-block`}>
        <Icon className="text-white h-6 w-6" />
      </div>
      <p className={`${textColor} mt-5`}>{label}</p>
      <h3 className={`text-2xl font-medium mt-1 ${textColor}`}>
        <CountUp end={value} />
      </h3>
    </div>
  );

  const AdminWidgets = [
    {
      icon: Users,
      label: "Total Users",
      value: dashboardData.users.length,
      textColor: "text-blue-500",
      bgColor: "bg-blue-400/20",
      iconColor: "bg-blue-500",
    },
    {
      icon: CreditCard,
      label: "Payments",
      value: dashboardData.payments.length,
      textColor: "text-green-500",
      bgColor: "bg-green-400/20",
      iconColor: "bg-green-500",
    },
    {
      icon: Ticket,
      label: "Tickets",
      value: dashboardData.tickets.length,
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-400/20",
      iconColor: "bg-yellow-500",
    },
    {
      icon: Calendar,
      label: "Events",
      value: dashboardData.events.length,
      textColor: "text-pink-500",
      bgColor: "bg-pink-400/20",
      iconColor: "bg-pink-500",
    },
    {
      icon: UserPlus,
      label: "New Users (7 days)",
      value: dashboardData.newUsers.length,
      textColor: "text-purple-500",
      bgColor: "bg-purple-400/20",
      iconColor: "bg-purple-500",
    },
  ];

  const AgentWidgets = [
    {
      icon: CreditCard,
      label: "Payments",
      value: agentDashboardData.payments.length,
      textColor: "text-green-500",
      bgColor: "bg-green-400/20",
      iconColor: "bg-green-500",
    },
    {
      icon: Ticket,
      label: "Tickets",
      value: agentDashboardData.tickets.length,
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-400/20",
      iconColor: "bg-yellow-500",
    },
    {
      icon: Calendar,
      label: "Events",
      value: agentDashboardData.events.length,
      textColor: "text-pink-500",
      bgColor: "bg-pink-400/20",
      iconColor: "bg-pink-500",
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
        {user?.role==="admin" && AdminWidgets.map((widget, index) => (
          <Widget key={index} {...widget} />
        ))}
        {user?.role==="agent" && AgentWidgets.map((widget, index) => (
          <Widget key={index} {...widget} />
        ))}
      </div>
      {userRole === "agent" && (
        <div className="mt-6">
          <AgentDashboardGraphs
            payments={agentDashboardData.payments}
            tickets={agentDashboardData.tickets}
            events={agentDashboardData.events}
          />
        </div>
      )}
      {userRole === "admin" && (
        <div className="mt-6">
          <AdminStats users={dashboardData.users} />
        </div>
      )}
      
    </div>
  );
};

export default Dashboard;
