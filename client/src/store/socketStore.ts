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