type User = {
  _id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "agent";
  revenue: number;
  createdAt: string;
  updatedAt: string;
};

type Event = {
  _id: string;
  title: string;
  description: string;
  eventDate: Date;
  location: {
    lat: number;
    lng: number;
  };
  region: string;
  price: number;
  images: string[];
  agentId: User;
  createdAt: string;
  updatedAt: string;
  category: string;
};

type Ticket = {
  _id: string;
  userId: User;
  eventId: Event;
  paymentId: string;
  status: "pending" | "approved" | "rejected";
};

type Payment = {
  _id: string;
  amount: number;
  ticketId: Ticket;
  paymentStatus: "pending" | "approved" | "rejected";
  paymentDate: Date;
  createdAt: string;
  updatedAt: string;
};

export type { Event, User, Payment, Ticket };
