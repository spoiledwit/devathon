import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toReadableDate } from "@/lib/utils";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URI;

export default function Notification() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await axios.get(`${BASE_URL}/notification`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Notifications", response.data);

      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative md:block hidden w-fit p-2 cursor-pointer mr-3 ">
          <span className="absolute right-[4px] top-[2px] bg-red-500 w-[20px] h-[20px] text-center font-light flex justify-center items-center text-[10px] text-white rounded-full">
            {notifications?.length}
          </span>
          <IoMdNotificationsOutline className="text-3xl text-black dark:text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-dark max-h-[300px] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-dark dark:text-white">
            Notifications
          </DialogTitle>
        </DialogHeader>
        {notifications.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-white">
            No notifications yet...
          </p>
        )}
        <div className="grid gap-4 py-4">
          
          {notifications?.map((notification: any) => (
            <div className="flex flex-row items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-white/80">
                <p className="text-sm text-gray-600 dark:text-white/80 font-medium">
                  {notification?.title}
                </p>
                <p>{notification?.description}</p>
                <p>{toReadableDate(notification?.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
