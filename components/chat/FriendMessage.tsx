import React, { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import MessageTime from "./MessageTime";
import AttachedImage from "./AttachedImage";
import MessageMenu from "./MessageMenu";
import Reactions from "./Reactions";
import { useTheme } from "@/context/ThemeProvider";

export default function FriendMessage({
  styles,
  item,
  currentTheme,
  currentColors,
  setReplyMessage,
  emoji,
  username,
  reply,
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const widthAnim = useRef(new Animated.Value(100)).current;
  const translateYAnim = useRef(new Animated.Value(300)).current;
  const heightAnim = useRef(new Animated.Value(100)).current;
  const translateXAnim = useRef(new Animated.Value(300)).current;
  const [expandedMenu, setExpandedMenu] = useState(false);
  const emojis = emoji?.map((reaction) => reaction.emoji) || [];
  const [reactions, setReactions] = useState(emojis);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const animateWidth = () => {
    const newExpanded = !expanded; // Фиксируем новое состояние перед анимацией

    if (newExpanded) {
      // Анимация открытия: сначала вверх, затем расширение
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: 0, // Поднимаем элемент
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: 140, // Увеличиваем ширину
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Анимация закрытия: сначала уменьшаем ширину, затем опускаем вниз
      Animated.sequence([
        Animated.timing(widthAnim, {
          toValue: 10, // Уменьшаем ширину
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(translateYAnim, {
          toValue: 50, // Опускаем вниз
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }

    // Инвертируем состояние
  };
  const animateHeight = () => {
    const newExpanded = !expandedMenu; // Фиксируем новое состояние перед анимацией

    if (newExpanded) {
      // Анимация открытия: сначала вверх, затем расширение
      Animated.sequence([
        Animated.timing(translateXAnim, {
          toValue: 240, // Поднимаем элемент
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(heightAnim, {
          toValue: 100, // Увеличиваем ширину
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Анимация закрытия: сначала уменьшаем ширину, затем опускаем вниз
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: 5, // Уменьшаем ширину
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0, // Опускаем вниз
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };
  return (
    <View
      style={[
        styles.friendMSG,
        item.file && {
          width: "60%",
          padding: 0,
          margin: 0,
          overflow: "hidden",
        },
      ]}
    >
      <Pressable
        onPress={() => {
          if (showReactions) {
            setExpanded(false);
            animateWidth();
            setTimeout(() => {
              setShowReactions(false);
            }, 700);
          } else {
            setExpanded(true);
            setShowReactions(true);
            animateWidth();
          }
        }}
        onLongPress={() => {
          if (showMessageMenu) {
            setExpandedMenu(false);
            animateHeight();
            setTimeout(() => {
              setShowMessageMenu(false);
            }, 700);
          } else {
            setExpandedMenu(true);
            setShowMessageMenu(true);
            animateHeight();
          }
        }}
      >
        {item.file && <AttachedImage uri={item.file} />}
        {reply && (
          <View
            style={{
              borderLeftWidth: 3,
              borderRadius: 4,
              padding: 3,
              borderColor: currentColors.nameColor,
              backgroundColor: currentColors.replyColor,
            }}
          >
            <Text style={{ color: currentColors.nameColor, fontWeight: "800" }}>
              {reply.username}
            </Text>
            <Text
              style={{
                color: colorPalette == "darkNight" ? "#fff" : "#000",
              }}
            >
              {reply.content}
            </Text>
          </View>
        )}
        {item.content ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            <Text style={styles.msgTextFriend}>{item.content}</Text>
            <MessageTime
              time={item.created_at}
              backgroundColor={"transparent"}
              textColor={currentTheme.infoText}
              position={""}
            />
          </View>
        ) : (
          <MessageTime
            time={item.created_at}
            backgroundColor={currentColors.nameColor}
            textColor={"#fff"}
            position={"absolute"}
          />
        )}
      </Pressable>
      {showReactions && (
        <Reactions
          currentColors={currentColors}
          width={widthAnim}
          translate={translateYAnim}
          setReactions={setReactions}
          side="left"
          username={username}
          emoji={emoji}
        />
      )}
      {showMessageMenu && (
        <MessageMenu
          currentColors={currentColors}
          height={heightAnim}
          translate={translateXAnim}
          itemID={item.id}
          setReplyMessage={setReplyMessage}
        />
      )}
      {reactions.length > 0 && <Text>{reactions}</Text>}
    </View>
  );
}
