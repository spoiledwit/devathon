import { create } from "zustand";

type SocketStore = {
    socket: any;
    setSocket: (socket: any) => void;
}

const useSocketStore = create<SocketStore>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
}));

export default useSocketStore;

// connecting to the socket

// useEffect(() => {
//     try {
//       const socket = io(`${import.meta.env.VITE_SOCKET_URI}`);
//       // set the socket state here
//       setSocket(socket);
//     } catch (error) {
//       console.error(error);
//     }

//   }, [])


// setting up listener for socket notifications

//   useEffect(() => {
//     if (socket) {
//       socket.on("getNotification", (notification) => {
//         if (notification.type === 'msg') {
//           setNotify(true);
//         } else if (notification.type === 'wishlist') {
//           getNotifications(token);
//         }
//       });
//     }

//     // Clean up event listener on unmount
//     return () => {
//       if (socket) {
//         socket.off("getNotification");
//       }
//     };
//   }, [socket, token]);


//   add user to socket

//   useEffect(() => {
//     if (user && socket) {
//       socket.emit("addUser", user.uid);
//     }
//   }, [user, socket]);