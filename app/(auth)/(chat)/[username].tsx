import {
  Button,
  FlatList,
  Image,
  Keyboard,
  ProgressBarAndroid,
  ProgressBarAndroidBase,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  I,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
import { useEffect, useRef, useState } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ModalAddFiles from "@/components/chat/ModalAddFiles";
import AttachedFiles from "@/components/chat/AttachedFiles";

import * as ImagePicker from "expo-image-picker";

import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import * as Network from "expo-network";
import AttachedImage from "@/components/chat/AttachedImage";
import CryptoJS from "crypto-js";
import forge from "node-forge";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { LinearGradient } from "expo-linear-gradient";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function ModalScreen() {
  const [message, setMessage] = useState("");

  const chat = useGlobal((state) => state.chat);
  const isLoading = useGlobal((state) => state.isLoadingChat);
  const chatKey = useGlobal((state) => state.chatKey);

  const getAllChats = useGlobal((state) => state.getAllChats);

  const [messages, setMessages] = useState([]);

  // console.log(chat.data, "chatik");
  const { signOut, session } = useSession();
  const scrollViewRef = useRef();
  const json_session = JSON.parse(session || "");
  // const isLoading = useGlobal((state) => state.isLoaiding);
  const { username } = useLocalSearchParams();
  const getFileUris = useGlobal((state) => state.getFileUris);
  const sendMessageG = useGlobal((state) => state.sendMessage);

  const commingMessage = useGlobal((state) => state.message);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  const [networkType, setNetworkType] = useState(null);

  const [privateKey, setPrivateKey] = useState("");
  const [encChatKey, setEncChatKey] = useState<CryptoJS.lib.WordArray | null>(
    null
  );

  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];

  const renderMSG = ({ item }) => {
    const username =
      item.username === json_session.user.username ? "ME" : item.username;
    const styleing = username === "ME" ? styles.myMSG : styles.friendMSG;
    const styledText =
      username === "ME" ? styles.msgTextMe : styles.msgTextFriend;
    return (
      <View style={styleing}>
        <Text style={styledText}>{item.message}</Text>
      </View>
    );
  };
  // ----------------------------------------------------------

  function decryptDataWithPrivateKey(encryptedData, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decodedData = forge.util.decode64(encryptedData); // Декодирование из base64
    console.log(
      "privateKey",
      privateKey,
      "encData",
      encryptedData,
      "decodedData",
      decodedData
    );
    const decrypted = privateKey.decrypt(decodedData, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    const final = forge.util.encode64(decrypted);
    console.log(final, "final");
    return final; // Возвращаем расшифрованные данные
  }

  function decryptDataWithChatKey(key, encryptedData) {
    try {
      console.log("Encrypted data:", encryptedData);
      console.log("Decryption key:", key);

      // Преобразуем зашифрованные данные из Base64 в WordArray
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);
      console.log("Ciphertext (parsed):", ciphertext.toString());

      // Дешифрация
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext }, // Зашифрованные данные
        key, // Преобразованный ключ
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Преобразование результата в строку UTF-8
      const plaintextDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
      console.log("Decrypted text (UTF-8):", plaintextDecrypted);

      return plaintextDecrypted || "Decryption failed"; // Возвращаем результат
    } catch (err) {
      console.log(key, encryptedData, "error during");
      console.error("Error during decryption:", err.message);
      return null;
    }
  }

  const getMessagesWithModifiedContent = (key, chatData) => {
    // Применяем функцию modifyContent к каждому элементу chatData
    chatData.map((item) => {
      console.log(
        item.content,
        decryptDataWithChatKey(key, item.content),
        "testing one two"
      );
    });
    return chatData.map((message) => ({
      ...message,
      content: decryptDataWithChatKey(key, message.content), // изменяем content
    }));
  };

  // ------------------------------------------------------------------------------------------
  const uploadFile = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "image.jpeg",
      type: "image/jpeg", // Можно использовать тип файла, если он известен
    });
    formData.append("upload_preset", "react_chat");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        // Content-Type автоматически установится при использовании FormData, можно удалить эту строку
      },
      onUploadProgress: (progressEvent) => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted); // Обновляем прогресс
      },
    };

    setUploading(true);
    setProgress(0);
    console.log(formData);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmdbrf10y/image/upload",
        formData,
        config
      );
      console.log("File uploaded:", response.data);
      setUploadedFileUrl(response.data.secure_url); // Используем secure_url вместо fileUrl
      await AsyncStorage.setItem(`@files_uri_${username}`, "");
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      getFileUris(username);

      if (chat?.data && encChatKey) {
        console.log(encChatKey, "hoi");
        const modifiedData = getMessagesWithModifiedContent(
          encChatKey,
          chat?.data
        );
        console.log("modiData", modifiedData);
        setMessages(modifiedData);
      }

      console.log(messages);
    }
  }, [isLoading, chat, encChatKey]);

  useEffect(() => {
    console.log(isLoading);
    AsyncStorage.getItem("@private_key")
      .then((res) => {
        if (!res) {
          throw new Error("Private key not found in AsyncStorage");
        }

        // Устанавливаем privateKey в состоянии
        setPrivateKey(res);
        console.log(chatKey, res, "megatest");
        // Расшифровываем chatKey с помощью приватного ключа
        const base64key = decryptDataWithPrivateKey(chatKey, res); // Используем res (строку из AsyncStorage)
        console.log(base64key, "base64key");

        // Устанавливаем ключ в состояние
        setEncChatKey(CryptoJS.enc.Base64.parse(base64key));
      })
      .catch((err) => {
        console.log(err, "Error retrieving private key");
      });
    console.log(privateKey, "private");
    console.log(chatKey, "public");

    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();

      setNetworkType(networkState.type);
    };

    // setEncChatKey(key);

    checkNetwork();
  }, [chat]);

  useEffect(() => {
    if (commingMessage?.content) {
      console.log("paral", commingMessage);
      // const modifiedData = getMessagesWithModifiedContent(
      //   encChatKey,
      //   commingMessage
      // );
      // console.log(modifiedData, "comming mod");
      const newMessage = {
        id: Math.random(),
        content: decryptDataWithChatKey(encChatKey, commingMessage?.content),
        username: username,
      };
      // messages.push(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      console.log("newMSG", newMessage);
    }
  }, [commingMessage]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
    console.log(messages);
  }, [messages]);
  const sendMessage = async () => {
    console.log("testing sendong message");
    const Paths = await AsyncStorage.getItem(`@files_uri_${username}`);
    const existingPaths = JSON.parse(Paths) || "";
    console.log("sending");
    if (existingPaths.length > 0) {
      uploadFile(existingPaths[0])
        .then((res) => {
          const messageContent = {
            text: message,
            file: res,
          };
          sendMessageG(messageContent, json_session.user.username, username);
          console.log(messageContent);
        })
        .catch((err) => console.log(err));
    } else {
      console.log(encChatKey, "encCHATKEY");
      const encrypted = CryptoJS.AES.encrypt(message, encChatKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7, // Обязательно для корректного шифрования
      });
      const encryptedData = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

      console.log("Encrypted Data with testKey:", encryptedData);

      // const decrypted = CryptoJS.AES.decrypt(
      //   encryptedData, // Зашифрованные данные
      //   testKey, // Преобразованный ключ
      //   {
      //     mode: CryptoJS.mode.ECB,
      //     padding: CryptoJS.pad.Pkcs7,
      //   }
      // );

      // // Преобразование результата в строку UTF-8
      // const plaintextDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
      // console.log("Decrypted Data with testKey:", plaintextDecrypted);

      const messageContent = {
        text: encryptedData,
        file: "",
      };
      sendMessageG(messageContent, json_session.user.username, username);
      console.log(messageContent);
    }
    const newMessage = {
      id: Math.random(),
      content: message,
      file: uploadedFileUrl,
      username: json_session.user.username,
    };
    setMessage("");
    // messages.push(newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    getAllChats();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },

    inputContiner: {
      flexDirection: "row",
      width: "90%",
      alignItems: "center",
      backgroundColor: "#e0e0e0",
      borderRadius: 50,
      marginTop: "auto",
      overflow: "hidden",
      justifyContent: "center",
    },

    textInput: {
      width: "80%",
      paddingHorizontal: 10,
      minHeight: 40,
      maxHeight: 150, // Limit height to show scrollbar on overflow

      fontSize: 15,

      overflow: "hidden", // Ensures text does not overflow the TextInput area
      textAlignVertical: "center", // Align text to the top for multiline input
    },

    friendMSG: {
      width: "40%",

      backgroundColor: currentColors.messageColor,
      borderRadius: 20,
      borderBottomLeftRadius: 0,
      marginLeft: 5,
      marginVertical: 5,
      padding: 10,
    },
    myMSG: {
      width: "40%",
      marginLeft: "auto",
      backgroundColor: currentColors.myMessageColor,
      fontSize: 15,
      borderRadius: 20,
      borderBottomRightRadius: 0,
      marginRight: 5,
      marginVertical: 5,
      padding: 10,
    },
    msgAuthorFriend: {
      fontSize: 20,
      textTransform: "uppercase",
    },
    msgAuthorMe: {},
    msgTextMe: {
      color: "#000",
      fontSize: 16,
    },
    msgTextFriend: {
      fontSize: 16,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient style={styles.container} colors={currentColors.gradient}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView ref={scrollViewRef} style={{ width: "100%" }}>
            {messages.map((item) =>
              item.username === json_session.user.username ? (
                <View key={item.id} style={styles.myMSG}>
                  {item.file && (
                    // <Image
                    //   source={{ uri: item.file }}
                    //   height={200}
                    //   width={200}
                    //   style={{
                    //     width: "100%",
                    //     borderRadius: 10,
                    //     resizeMode: "contain",
                    //   }}
                    // />
                    <AttachedImage uri={item.file} />
                  )}

                  <Text style={styles.msgTextMe}>{item.content}</Text>
                </View>
              ) : (
                <View key={item.id} style={styles.friendMSG}>
                  <Text style={styles.msgTextFriend}>{item.content}</Text>
                </View>
              )
            )}
          </ScrollView>
        )}

        <AttachedFiles />
        {uploading && (
          <View style={{ marginTop: 20 }}>
            <Text>Uploading: {progress}%</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress / 100}
            />
          </View>
        )}
        {uploadedFileUrl && (
          <View style={{ marginTop: 20 }}>
            <Text>File uploaded successfully!</Text>
            <Text>File URL: {uploadedFileUrl}</Text>
          </View>
        )}
        <View style={styles.inputContiner}>
          <ModalAddFiles />
          <TextInput
            style={styles.textInput}
            multiline
            scrollEnabled
            placeholder="Message"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableWithoutFeedback onPress={() => sendMessage()}>
            <FontAwesome name="send" size={25} color="#000" />
          </TouchableWithoutFeedback>
        </View>
        <FlashMessage position="top" />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
