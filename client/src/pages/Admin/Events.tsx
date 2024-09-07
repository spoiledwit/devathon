import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Trash2, Loader, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Locator from "@/components/Locator/Locator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import PhotosUploader from "@/components/ImageUploader";

const BASE_URL = import.meta.env.VITE_BASE_URI;

interface Event {
  _id: string;
  title: string;
  eventDate: string;
  description: string;
  location: string;
  category: string;
  images: string[];
  price: number;
  agentId: string;
  region: string;
}

interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

interface EventWidgetProps {
  icon: React.ElementType;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const EventWidget: React.FC<EventWidgetProps> = ({
  icon: Icon,
  label,
  value,
  bgColor,
  iconColor,
  textColor,
}) => (
  <Card className={`${bgColor}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    </CardContent>
  </Card>
);

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [eventStats, setEventStats] = useState<EventStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
  });
  const [region, setRegion] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [images, setImages] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Event[]>(`${BASE_URL}/api/events`);
      setEvents(response.data);
      updateEventStats(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const updateEventStats = (eventData: Event[]) => {
    const now = new Date();
    const stats: EventStats = {
      totalEvents: eventData.length,
      upcomingEvents: eventData.filter(
        (event) => new Date(event.eventDate) > now
      ).length,
      pastEvents: eventData.filter((event) => new Date(event.eventDate) <= now)
        .length,
    };
    setEventStats(stats);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/events/${eventToDelete._id}`);
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        location: `${location.lat},${location.lng}`,
        region,
        images,
      };
      await axios.post(`${BASE_URL}/event`, eventData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });
      toast.success("Event created successfully");
      fetchEvents();
      setCreateDialogOpen(false);
      setNewEvent({});
      setRegion("");
      setLocation({ lat: 0, lng: 0 });
      setImages([]);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Event Management</h1>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <EventWidget
          icon={Calendar}
          label="Total Events"
          value={eventStats.totalEvents}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          textColor="text-blue-600"
        />
        <EventWidget
          icon={Calendar}
          label="Upcoming Events"
          value={eventStats.upcomingEvents}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          textColor="text-green-600"
        />
        <EventWidget
          icon={Calendar}
          label="Past Events"
          value={eventStats.pastEvents}
          bgColor="bg-red-100"
          iconColor="text-red-600"
          textColor="text-red-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Table</CardTitle>
          <CardDescription>Manage your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>${event.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setEventToDelete(event);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[100vh] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="flex-grow pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eventDate" className="text-right">
                  Date
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEvent.eventDate || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventDate: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <div className="col-span-3">
                  <Locator
                    setLocation={setLocation}
                    Location={location}
                    selectRegion={setRegion}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">
                  Images
                </Label>
                <div className="col-span-3">
                  <PhotosUploader
                    addedPhotos={images}
                    onChange={setImages}
                    maxPhotos={5}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newEvent.category || ""}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newEvent.price || ""}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
