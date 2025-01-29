import React from "react";
import { Text, View } from "react-native";

export default function MessageTime({
  time,
  backgroundColor,
  textColor,
  position,
}) {
  function formatTime(dateString) {
    // Создаем объект Date из строки даты
    const date = new Date(dateString);

    // Получаем часы и минуты
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Добавляем ведущий ноль, если необходимо
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Возвращаем отформатированное время
    return `${hours}:${minutes}`;
  }
  return (
    <View style={{ position: position, right: 10, bottom: 10 }}>
      <Text
        style={[
          {
            paddingVertical: 2,
            paddingHorizontal: 5,
            backgroundColor: backgroundColor,
            borderRadius: 50,
            color: textColor,
            opacity: 0.8,
          },
          !position && { marginRight: 0, marginBottom: 2 },
        ]}
      >
        {formatTime(time)}
      </Text>
    </View>
  );
}
