import  { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AgentDashboardGraphs = ({ events, tickets, payments }:{
    events: any[],
    tickets: any[],
    payments: any[]
}) => {
  const eventsByCategory = useMemo(() => {
    const categories = {};
    events.forEach(event => {
        //@ts-ignore
      categories[event.category] = (categories[event.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [events]);

  const ticketStatusCount = useMemo(() => {
    const statusCount = { pending: 0, approved: 0, rejected: 0 };
    tickets.forEach(ticket => {
        //@ts-ignore
      statusCount[ticket.status]++;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const revenueByMonth = useMemo(() => {
    const monthlyRevenue = {};
    payments.forEach(payment => {
      const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short' });
        //@ts-ignore
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
    });
    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
  }, [payments]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(event => new Date(event.eventDate) > now)
      //@ts-ignore
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
      .slice(0, 5)
      .map(event => ({
        name: event.title,
        //@ts-ignore
        daysUntil: Math.ceil((new Date(event.eventDate) - now) / (1000 * 60 * 60 * 24))
      }));
  }, [events]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Events by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={eventsByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {eventsByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Ticket Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ticketStatusCount}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={upcomingEvents} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="daysUntil" fill="#8884d8" name="Days until event" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgentDashboardGraphs;