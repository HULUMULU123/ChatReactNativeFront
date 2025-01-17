import { useTheme } from "@/context/ThemeProvider";
import React from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { themes, colorPalettes } from "@/context/themes";
import { LinearGradient } from "expo-linear-gradient";
export default function ThemeChoice({ backgroundColor }) {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const data = [
    {
      id: "blueGreen",
      title: "Item 1",
      colors: ["#4facfe", "#00f2fe"],
      messageColor: "#99eaff",
      myMessageColor: "#fff",
      colorName: "⛄",
    },
    {
      id: "pinkPurple",
      title: "Item 2",
      colors: ["#ff9a9e", "#fad0c4"],
      messageColor: "#ffc1e3",
      myMessageColor: "#fff",
      colorName: "🌹",
    },
    {
      id: "sunset",
      title: "Item 3",
      colors: ["#ff6a00", "#ee0978"],
      messageColor: "#ffa366",
      myMessageColor: "#fff",
      colorName: "🐫",
    },
    {
      id: "sand",
      title: "Item 4",
      colors: ["#fdbb2d", "#22c1c3"],
      messageColor: "#d3f5fe",
      myMessageColor: "#fff",
      colorName: "🏝️",
    },
    {
      id: "warmCoral",
      title: "Item 5",
      colors: ["#ff7e5f", "#feb47b"],
      messageColor: "#ffd9c5",
      myMessageColor: "#fff",
      colorName: "🍹",
    },
    {
      id: "deepPurple",
      title: "Item 5",
      colors: ["#8e44ad", "#3498db"],
      messageColor: "#a5d8f3",
      myMessageColor: "#f3e5f5",
      colorName: "🛰️",
    },
    {
      id: "cosmos",
      title: "Item 5",
      colors: ["#2b5876", "#4e4376"],
      messageColor: "#c2c1d1",
      myMessageColor: "#dbe9f3",
      colorName: "🚀",
    },
    {
      id: "darkNight",
      title: "Item 5",
      colors: ["#232526", "#414345"],
      messageColor: "#757575",
      myMessageColor: "#d9d9d9",
      colorName: "🌚",
    },
    {
      id: "tealPurple",
      title: "Item 5",
      colors: ["#6a11cb", "#2575fc"],
      messageColor: "#dab6fc",
      myMessageColor: "#e0e8ff",
      colorName: "🌌",
    },
    {
      id: "vibrantOrange",
      title: "Item 5",
      colors: ["#f85032", "#e73827"],
      messageColor: "#ffad99",
      myMessageColor: "#ffe4e1",
      colorName: "🦧",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => changeColorPalette(item.id)}>
      <View
        style={{
          borderWidth: 3,
          borderColor:
            item.id == colorPalette ? currentTheme.system : "transparent",
          borderRadius: 20,
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        <LinearGradient
          style={{
            backgroundColor: currentTheme.background,
            borderColor:
              item.id == colorPalette ? currentTheme.system : "transparent",
            padding: 4,
            height: 150,
            width: 100,
            margin: 3,
            borderRadius: 15,

            position: "relative",
          }}
          colors={item.colors}
        >
          <View
            style={{
              marginTop: 30,
              marginLeft: 3,
              width: "60%",
              height: "20%",
              backgroundColor: item.messageColor,
              borderRadius: 10,
              borderBottomLeftRadius: 0,
            }}
          ></View>
          <View
            style={{
              marginTop: 30,
              position: "absolute",
              width: "60%",
              height: "20%",
              backgroundColor: item.myMessageColor,
              borderRadius: 10,
              borderBottomRightRadius: 0,
              right: 5,
              top: 50,
            }}
          ></View>
          <Text
            style={{ position: "absolute", bottom: 5, fontSize: 25, left: 32 }}
          >
            {item.colorName}
          </Text>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={data} // Массив данных
      renderItem={renderItem} // Компонент для рендера каждого элемента
      keyExtractor={(item) => item.id} // Уникальный ключ для каждого элемента
      horizontal={true} // Включаем горизонтальный скролл
      showsHorizontalScrollIndicator={false} // Убираем индикатор прокрутки
      contentContainerStyle={styles.list} // Стили для списка
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
  },
});
