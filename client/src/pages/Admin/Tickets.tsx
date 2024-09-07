import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { Ticket } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component from your UI library

const BASE_URL = import.meta.env.VITE_BASE_URI;

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const role = useAuthStore((state) => state.user?.role);
  const URL = role === "admin" ? "/" : "/agents";

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get<{ tickets: Ticket[] }>(
        `${BASE_URL}/ticket/${URL}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return <Badge variant="default">Approved</Badge>;
    } else if (status === "pending") {
      return <Badge variant="secondary">Pending</Badge>;
    } else {
      return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket._id} className="shadow-lg relative overflow-hidden">
              {/* Event image */}
              <img
                src={ticket.eventId.images[0]}
                alt={ticket.eventId.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold">{ticket.eventId.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  {new Date(ticket.eventId.eventDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm">{ticket.eventId.description}</p>
                <p className="text-sm font-medium mt-2">
                  Location: {ticket.eventId.region}
                </p>
                <p className="text-sm font-medium mt-1">
                  Price: ${ticket.eventId.price / 100}
                </p>
                <p className="text-sm font-medium mt-1">
                  Category: {ticket.eventId.category}
                </p>
                <div className="mt-4">{getStatusBadge(ticket.status)}</div>
              </CardContent>
              {/* Ticket border styling */}
              <div className="absolute top-0 left-0 w-full h-full border-dashed border-2 border-gray-300 pointer-events-none"></div>
            </Card>
          ))
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
}
