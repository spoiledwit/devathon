import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { Link, useNavigate } from "react-router-dom";
import LiveChat from "@/components/LiveChat";
import VideoCall from "@/components/VideoCall";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button";

const Booking = ({ item, }: { item: any }) => {

  const { toast } = useToast();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!item._id) {
      return;
    }

    try {
      setBooking(true);
      // const res = await addToCart(cartItem);
      // if (res) {
      toast({
        title: "Registered for event!",
        description: "You have successfully been registered",
      });
      // }
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    setBooking(false);
  };

  return (
    <div className="w-full rounded-md shadow-xl p-7 border gap-4 flex flex-col">
      <h3 className="text-2xl font-semibold text-black">
        ${item.price}
      </h3>
      <div className="flex flex-col gap-0">
        {/* <PersonSelector
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          infants={infants}
          setInfants={setInfants}
        /> */}
      </div>
      <button
        onClick={handleAddToCart}
        disabled={booking || !user}
        type="button"
        className="bg-[#FF385C] text-white font-semibold py-2 rounded-md"
      >
        {booking ? "Reserving" :
          user?.role === 'user' ? "You are not an admin" : !user ? "Login to reserve" : "Reserve"
        }
      </button>
      <div className="border-t pt-5 font-semibold text-gray-900 flex flex-row items-center justify-between">
        <p>Total before taxes</p>
        <p>${item.price}</p>
      </div>
      <Link to={'/chat'}>
        <Button className="bg-black text-white rounded-md w-full">
          Chat
        </Button>
      </Link>
      {/* <LiveChat item={item} /> */}
      {/* @ts-ignore */}
      <VideoCall item={item} />
    </div>
  );
};

export default Booking;
