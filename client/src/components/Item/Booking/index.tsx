import { useState } from "react";
import Calendar from "./Calender";
import PersonSelector from "./PersonSelector";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
// import { addToCart } from "@/lib/cart";
import LiveChat from "@/components/LiveChat";
import VideoCall from "@/components/VideoCall";
import { countDaysBetween } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const Booking = ({ item, endDate, startDate, setEndDate, setStartDate }: { item: any, endDate: Date, startDate: Date, setStartDate: any, setEndDate: any }) => {

  const { toast } = useToast();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<boolean>(false);
  const navigate = useNavigate();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!item._id) {
      return;
    }

    if (!startDate) {
      toast({
        title: "Please select a date",
        description: "Please select a date to continue",
      });
      return;
    }

    let calculatedPrice = 10 * adults;

    calculatedPrice += calculatedPrice * 0.9 * children;

    const cartItem: any = {
      itemId: item._id,
      selectedDate: startDate,
      persons: {
        adults,
        children,
        infants,
      },
      totalPrice: calculatedPrice,
    };

    // if (user?.cart.find((item: any) => item === cartItem.itemId.toString())) {
    //   toast({
    //     title: "Item already in reserved",
    //     variant: "destructive",
    //   });
    //   return;
    // }

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
        ${item.price} <span className="text-base font-normal text-gray-700">night</span>
      </h3>
      <div className="flex flex-col gap-0">
        <div className="flex flex-row w-full">
          <div className="w-1/2 border border-r-0 rounded-tl">
            <Calendar startDate={startDate} title="Check-in" setStartDate={setStartDate} />
          </div>
          <div className="w-1/2 border rounded-tr">
            <Calendar startDate={endDate} title="Check-out" setStartDate={setEndDate} />
          </div>
        </div>
        <PersonSelector
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          infants={infants}
          setInfants={setInfants}
        />
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
      <p className="text-center text-sm opacity-80">You won't be charged yet</p>
      <div className="flex flex-row items-center justify-between">
        <p>${item.price} x {countDaysBetween(startDate, endDate)} nights</p>
        <p>${item.price * countDaysBetween(startDate, endDate)}</p>
      </div>
      {/* <Complaint item={item} /> */}
      {/* @ts-ignore */}
      <div className="border-t pt-5 font-semibold text-gray-900 flex flex-row items-center justify-between">
        <p>Total before taxes</p>
        <p>${item.price * countDaysBetween(startDate, endDate)}</p>
      </div>
      <LiveChat item={item} />
      {/* @ts-ignore */}
      <VideoCall item={item} />
    </div>
  );
};

export default Booking;
