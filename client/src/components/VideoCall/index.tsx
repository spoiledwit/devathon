import useSocketStore from "@/store/socketStore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useAuthStore from "@/store/authStore";
import { Link } from "react-router-dom";

const VideoCall = ({ item }: { item: any }) => {
  const { socket } = useSocketStore();
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    socket.on("onlineUsers", (users: any) => {
      setOnlineUsers(users);
    });
    socket.emit("getOnlineUsers");
    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  if (
    onlineUsers.find((user: any) => user.userId === item.sellerId) &&
    user?._id !== item.sellerId
  ) {
    return (
      <div className="relative mt-[-10px]">
        <Button className="w-full">
          <Link to={`/video-call`}>Start Video Call</Link>
        </Button>
        <div className="absolute top-[-2px] right-[-3px] bg-green-500 w-3 h-3 rounded-full" />
      </div>
    );
  }
};

export default VideoCall;