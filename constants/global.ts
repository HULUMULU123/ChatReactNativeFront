import { isLoading } from "expo-font";
import { Platform } from "react-native";
import { create } from "zustand";

// WEBSOCKET

// function responseSearch(set, get, data) {
//   console.log(data);
//   set((state) => ({
//     searchList: data,
//   }));
// }

type GlobalState = {
  socket: any;
  isLoaiding: boolean;
  socketConnect: (tokens: { access: string; refresh: string }) => void;
  socketClose: () => void;
  searchList: any;
  searchUsers: (query: any) => void;
  message: any;
  sendMessage: (msg: any, from: any, to: any) => void;
  chat: any;
  isLoadingChat: boolean;
  getChat: (user1: string, user2: string) => void;
  getAllChats: () => void;
  allChats: any;
};

const useGlobal = create<GlobalState>((set, get) => ({
  socket: null,
  isLoaiding: false,
  isLoadingChat: false,
  socketConnect: async (tokenss: { access: string; refresh: string }) => {
    const tokens = tokenss;
    const socket = new WebSocket(
      `ws://10.0.2.2:8000/chat/?token=${tokens.access}`
    );
    socket.onopen = () => {
      console.log("soket onopen");
      socket.send(
        JSON.stringify({
          source: "index",
        })
      );
    };
    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      if (parsed.source == "search") {
        set((state) => ({
          searchList: parsed.data,
          isLoaiding: false,
        }));
      }
      if (parsed.source == "get_chat") {
        // console.log(parsed.data);
        set((state) => ({
          chat: parsed.data,
          isLoadingChat: false,
        }));
      }
      if (parsed.source == "chat_message") {
        set((state) => ({
          message: parsed.data,
        }));
        socket.send(
          JSON.stringify({
            source: "index",
          })
        );
      }
      if (parsed.source == "get_all_chats") {
        set((state) => ({
          allChats: parsed.data,
        }));
      }
      // const responses = {
      //   search: responseSearch,
      // };
      // const resp = responses[parsed.source];
      // if (!resp) {
      //   console.log("error");
      //   return;
      // }
      // resp(set, get, parsed.data);
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
      set((state) => ({
        isLoaiding: true,
      }));
      const socket = get().socket;
      // console.log(query);
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

  // Sendig messages

  message: null,

  sendMessage: (msg: any, from: string, to: string) => {
    if (msg) {
      const socket = get().socket;
      socket.send(
        JSON.stringify({
          source: "send_message",
          from,
          to,
          msg,
        })
      );
    }
  },

  // Open chat

  chat: null,

  getChat: (user1: string, user2: string) => {
    if (user1 && user2) {
      set((state) => ({
        isLoadingChat: true,
      }));
      const socket = get().socket;
      socket.send(
        JSON.stringify({
          source: "get_chat",
          user1,
          user2,
        })
      );
    }
  },
  allChats: null,
  getAllChats: () => {
    const socket = get().socket;
    socket.send(
      JSON.stringify({
        source: "index",
      })
    );
  },
}));

export default useGlobal;
