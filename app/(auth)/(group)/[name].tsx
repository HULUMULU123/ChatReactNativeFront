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
  Pressable,
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
import React from "react";
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
import { BallIndicator } from "react-native-indicators";
import MessageTime from "@/components/chat/MessageTime";
import Reactions from "@/components/chat/Reactions";
import MyMessage from "@/components/chat/MyMessage";
import FriendMessage from "@/components/chat/FriendMessage";
import ReplyMessage from "@/components/chat/ReplyMessage";
import MyMessageGroup from "@/components/chat/MyMessageGroup";
import FriendMessageGroup from "@/components/chat/FriendMessageGroup";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function ModalScreen() {
  const [message, setMessage] = useState("");

  const isLoading = useGlobal((state) => state.isLoadingChat);
  const getGroup = useGlobal((state) => state.getGroup);
  const group = useGlobal((state) => state.group);
  const [messages, setMessages] = useState([]);

  // console.log(chat.data, "chatik");
  const { signOut, session } = useSession();
  const scrollViewRef = useRef();
  const json_session = JSON.parse(session || "");

  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const { name } = useLocalSearchParams();
  useEffect(() => {
    getGroup(name);
    console.log(
      group,
      json_session.user.username,
      "======================================================================="
    );
  }, []);
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
      width: "100%",
      alignItems: "center",
      backgroundColor: currentTheme.background,

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
      // minWidth: "40%",
      maxWidth: "90%",
      marginRight: "auto",
      backgroundColor: currentColors.messageColor,
      borderRadius: 20,
      borderBottomLeftRadius: 0,
      marginLeft: 5,
      marginVertical: 5,
      padding: 10,
      flexShrink: 1,
    },
    myMSG: {
      // minWidth: "40%",
      maxWidth: "90%", // Ограничиваем максимальную ширину
      marginLeft: "auto",
      borderRadius: 20,
      borderBottomRightRadius: 0,
      marginRight: 5,
      marginVertical: 5,
      padding: 10,
      flexShrink: 1,
      backgroundColor: currentColors.myMessageColor,
      position: "relative",
    },
    msgAuthorFriend: {
      fontSize: 20,
      textTransform: "uppercase",
    },
    msgAuthorMe: {},
    msgTextMe: {
      color: "#000",
      fontSize: 16,
      minWidth: "10%",
      maxWidth: "90%",
      marginRight: 10,
    },
    msgTextFriend: {
      backgroundColor: "transparent",
      fontSize: 16,
      minWidth: "10%",
      maxWidth: "90%",
      marginRight: 10,
    },
  });
  const formatDate = (date: string) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth(); // Месяц начинается с 0 (январь = 0)

    return `${day} ${months[month]}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient style={styles.container} colors={currentColors.gradient}>
        {group?.data.map((item) =>
          json_session.user.username == item.sender_username ? (
            <MyMessageGroup
              key={item.id} // Обязательно добавь key
              item={item}
              styles={styles}
              username={json_session.username}
              currentColors={currentColors}
              currentTheme={currentTheme}
            />
          ) : (
            <FriendMessageGroup
              item={item}
              currentColors={currentColors}
              currentTheme={currentTheme}
              styles={styles}
            />
          )
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
          <TouchableWithoutFeedback>
            <FontAwesome name="send" size={25} color={currentTheme.infoText} />
          </TouchableWithoutFeedback>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
