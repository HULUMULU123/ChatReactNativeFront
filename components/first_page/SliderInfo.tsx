import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";
import { Link } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from "react-native";

const { width } = Dimensions.get("window"); // Ширина экрана
const newWidth = width * 0.6;
const slides = [
  {
    id: "0",
    text: "Every conversation here feels personalized and efficient, thanks to the great design by RoodenSky!",
  },
  {
    id: "1",
    text: "A big shoutout to RoodenSky for creating such an incredible experience.",
  },
  {
    id: "2",
    text: "This chat is truly amazing – always helpful and insightful!",
  },
];

export default function SliderInfo() {
  const scrollX = useRef(new Animated.Value(0)).current; // Для анимации прокрутки
  const [currentIndex, setCurrentIndex] = useState(1); // Индекс текущего слайда
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  useEffect(() => {
    // Запуск автоматической прокрутки
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Прокрутка каждые 3 секунды

    return () => clearInterval(interval); // Очистка при размонтировании
  }, []);

  // Анимация слайдов
  useEffect(() => {
    Animated.timing(scrollX, {
      toValue: currentIndex * newWidth, // Прокрутка на ширину текущего слайда
      duration: 500, // Длительность перехода
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentTheme.blockBackground,
      padding: 30,
      borderRadius: 10,
    },
    slide: {
      marginTop: 10,
      width: newWidth,
      justifyContent: "center",
      alignItems: "center",
    },
    slideText: {
      fontSize: 13,
      fontWeight: "400",
      textAlign: "center",
      color: "#5e5e5e",
      lineHeight: 20,
    },
    indicatorContainer: {
      //   position: "absolute",
      //   bottom: 5,
      marginTop: 5,
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    indicator: {
      height: 3,
      width: 3,
      borderRadius: 5,
      backgroundColor: "#dbdbdb",
      marginHorizontal: 5,
    },
    activeIndicator: {
      backgroundColor: "#5b5a5a",
    },
  });
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={{ width: 70, height: 70, borderRadius: 90 }}
      />
      <Text
        style={{
          color: "#3a3a3a",
          fontSize: 20,
          fontWeight: "600",
          marginTop: 10,
        }}
      >
        RoodenSky
      </Text>
      {/* Слайды */}
      <View style={{ width: newWidth, overflow: "hidden" }}>
        <Animated.View
          style={{
            flexDirection: "row",

            width: slides.length * newWidth,
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange: [0, slides.length * newWidth],
                  outputRange: [0, -slides.length * newWidth],
                }),
              },
            ],
          }}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <Text style={styles.slideText}>{slide.text}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
      {/* Индикатор слайдов */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
      <Link href="/login" style={{ marginTop: 5 }}>
        <View
          style={{
            backgroundColor: currentTheme.brand,
            padding: 10,
            borderRadius: 7,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "500" }}>
            Start Messaging
          </Text>
        </View>
      </Link>
    </View>
  );
}
