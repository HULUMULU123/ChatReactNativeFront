import AsyncStorage from "@react-native-async-storage/async-storage";
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
  chatKey: any;
  getAllChats: () => void;
  allChats: any;
  fileUris: [];
  getFileUris: (chat: string) => void;
  deleteFileUri: (index: number, chat: any) => void;
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
        console.log(parsed.data.data, "get_chat");
        set((state) => ({
          chat: parsed.data,
          isLoadingChat: false,
          chatKey: parsed.data.chat_key,
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
    socket.onerror = (e) => {
      console.log("soket error", e);
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
  chatKey: null,
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
  fileUris: [],
  getFileUris: async (chat) => {
    try {
      const fileUri = await AsyncStorage.getItem(`@files_uri_${chat}`);
      if (fileUri) {
        console.log("Saved file patssssh:", chat, JSON.parse(fileUri));
        set((state) => ({
          fileUris: JSON.parse(fileUri),
        }));
      } else {
        console.log("No file path saved");
        set((state) => ({
          fileUris: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching file path", error);
    }
  },
  deleteFileUri: async (index, chat) => {
    try {
      const fileUri = await AsyncStorage.getItem(`@files_uri_${chat}`);
      if (fileUri) {
        const newFileUri = JSON.parse(fileUri);
        newFileUri.splice(index, 1);
        set((state) => ({
          fileUris: newFileUri,
        }));
        await AsyncStorage.setItem(
          `@files_uri_${chat}`,
          JSON.stringify(newFileUri)
        );
      } else {
        console.log("No file path saved");
      }
    } catch (error) {
      console.error("Error fetching file path", error);
    }
  },
}));

export default useGlobal;
