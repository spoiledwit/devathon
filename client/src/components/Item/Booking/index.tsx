import React, { useState } from "react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import LiveChat from "@/components/LiveChat";
import VideoCall from "@/components/VideoCall";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BookingProps {
  item: {
    _id: string;
    price: number;
    title: string;
    eventDate: string;
  };
}

const BASE_URL = import.meta.env.VITE_BASE_URI;

const Booking: React.FC<BookingProps> = ({ item }) => {
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!item._id) {
      toast.error("Item not found.");
      return;
    }

    try {
      setBooking(true);
      const res = await axios.post(
        `${BASE_URL}/ticket`,
        { eventId: item._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { session } = res.data;
      window && window.open(session.url, "_blank");
      toast.success("Booking successful.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBooking(false);
    }
  };

  const isUserEligibleToBook = user;

  return (
    <div className="w-full rounded-md shadow-xl p-7 border gap-4 flex flex-col">
      <Toaster />
      <h3 className="text-2xl font-semibold text-black">${item.price}</h3>
      <Button
        onClick={handleAddToCart}
        disabled={booking || !isUserEligibleToBook}
        className="bg-[#FF385C] text-white font-semibold py-2 rounded-md hover:bg-[#E61E4D]"
      >
        {booking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Reserving...
          </>
        ) : !user ? (
          "Login to reserve"
        ) : !isUserEligibleToBook ? (
          "You are not eligible to book"
        ) : (
          "Reserve"
        )}
      </Button>
      <div className="border-t pt-5 font-semibold text-gray-900 flex flex-row items-center justify-between">
        <p>Total before taxes</p>
        <p>${item.price}</p>
      </div>
      <LiveChat item={item} />
      <VideoCall item={item} />
    </div>
  );
};

export default Booking;
