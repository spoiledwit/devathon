import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import "react-big-calendar/lib/css/react-big-calendar.css";

import useAuthStore from "@/store/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URI;

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface Event {
  _id: string;
  title: string;
  location: string;
  category: string;
  price: number;
  region: string;
  eventDate: string;
  description: string;
  images: string[];
  agentId: string;
  start: Date;
  end: Date;
}

const AdminEventCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  if(!user) {
    return <div>Loading...</div>
  }

  const { role } = user;
  const url = role === "admin" ? "/admin/events" : "/event/agent";

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ events: Event[] }>(
        `${BASE_URL}${url}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data && Array.isArray(response.data.events)) {
        const formattedEvents = response.data.events.map((event) => ({
          ...event,
          start: new Date(event.eventDate),
          end: new Date(event.eventDate),
        }));
        setEvents(formattedEvents);
      } else {
        throw new Error("Received invalid data format for events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again later.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Admin Event Calendar</h1>
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-full lg:w-3/4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
        <div className="w-full lg:w-1/4">
          <h2 className="text-xl font-semibold mb-2">Event Details</h2>
          {selectedEvent ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <p>
                  Date: {moment(selectedEvent.eventDate).format("MMMM D, YYYY")}
                </p>
                <p>Location: {selectedEvent.location}</p>
                <p>Category: {selectedEvent.category}</p>
                <p>Price: ${selectedEvent.price}</p>
                <p>Region: {selectedEvent.region}</p>
                <p>Description: {selectedEvent.description}</p>
              </CardContent>
            </Card>
          ) : (
            <p>Select an event to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventCalendar;
