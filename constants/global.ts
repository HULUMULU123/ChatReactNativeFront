import { Platform } from "react-native";
import { create } from "zustand";

// WEBSOCKET

type GlobalState = {
  socket: any;
  socketConnect: (tokens: { access: string; refresh: string }) => void;
  socketClose: () => void;
  searchList: any;
  searchUsers: (query: any) => void;
};

const useGlobal = create<GlobalState>((set, get) => ({
  socket: null,
  socketConnect: async (tokenss: { access: string; refresh: string }) => {
    const tokens = tokenss;
    const socket = new WebSocket(
      `ws://10.0.2.2:8000/chat/?token=${tokens.access}`
    );
    socket.onopen = () => {
      console.log("soket onopen");
    };
    socket.onerror = () => {
      console.log("soket error");
    };
    socket.onclose = () => {
      console.log("soket close");
    };
    console.log(`[${Platform.OS}]`, tokens.access);
    set((state) => ({
      socket: socket,
    }));
  },
  socketClose: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
    }
    set((state) => ({
      socket: null,
    }));
  },

  //   Search

  searchList: null,

  searchUsers: (query: any) => {
    if (query) {
      const socket = get().socket;
      console.log(query);
      socket.send(
        JSON.stringify({
          source: "search",
          query: query,
        })
      );
    } else {
      set((state) => ({
        searchList: null,
      }));
    }
  },
}));

export default useGlobal;
