import Events from "./Events/Events";
import { useEffect, useState } from "react";
import { Event } from "@/types";
import axios from "axios";

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/event/all`);
      console.log(res.data);
      setEvents(res.data.events);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="w-full p-5 px-20">
          {loading ? (
            <div className="animate-pulse gap-5 grid grid-cols-4">
              {
                Array.from({ length: 5 }).map((_, i) => (
                  <div className="flex flex-col gap-2" key={i}>
                    <div className="h-44 rounded-md bg-gray-200" ></div>
                    <div className="h-5 rounded-md bg-gray-200" ></div>
                  </div>
                ))
              }
            </div>
          )
            :
            events && events.length > 0 ?
              <Events events={events} />
              :
              <div>
                <h1 className="text-2xl text-black font-medium">No events available</h1>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
