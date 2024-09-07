import React, { useState } from "react";
import useAuthStore from "@/store/authStore";
import {  useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MessageCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

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
  const [chatLoading, setChatLoading] = useState<boolean>(false);
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
      toast.success("Booking successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during booking.");
    } finally {
      setBooking(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!item._id) {
      toast.error("Item not found.");
      return;
    }
    try {
      setChatLoading(true);
      const res = await axios.post(
        `${BASE_URL}/conversation`,
        { id: item._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate(`/chat`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to start conversation.");
    } finally {
      setChatLoading(false);
    }
  };

  const isUserEligibleToBook = user;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <Toaster />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-gray-900">${item.price}</h3>
          <div className="text-sm text-gray-500">
            <Calendar className="inline mr-1" size={16} />
            {new Date(item.eventDate).toLocaleDateString()}
          </div>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={booking || !isUserEligibleToBook}
          className="w-full bg-[#FF385C] text-white font-semibold py-3 rounded-lg hover:bg-[#E61E4D] transition-colors duration-300 mb-4"
        >
          {booking ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Reserving...
            </>
          ) : !user ? (
            "Login to reserve"
          ) : !isUserEligibleToBook ? (
            "You are not eligible to book"
          ) : (
            <>
              <DollarSign className="mr-2 h-5 w-5" />
              Reserve Now
            </>
          )}
        </Button>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 font-medium">Total before taxes</span>
          <span className="text-2xl font-bold text-gray-900">${item.price}</span>
        </div>
        
        <Button 
          onClick={handleCreateConversation}
          className="w-full bg-gray-900 text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition-colors duration-300"
          disabled={chatLoading}
        >
          {chatLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <MessageCircle className="mr-2 h-5 w-5" />
          )}
          {chatLoading ? "Starting chat..." : "Chat with organizer"}
        </Button>
      </div>
    </motion.div>
  );
};

export default Booking;