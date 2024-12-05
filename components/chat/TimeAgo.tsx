import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

function TimeAgo({ timestamp }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeAgo(calculateTimeAgo(timestamp)); // Обновление времени
    };

    updateTime(); // Первоначальный расчет времени
    const interval = setInterval(updateTime, 60000); // Обновление каждую минуту

    return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
  }, [timestamp]);

  function calculateTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - new Date(date); // Разница в миллисекундах
    const diffInSec = Math.floor(diffInMs / 1000); // Время в секундах
    const diffInMin = Math.floor(diffInSec / 60); // Время в минутах
    const diffInHour = Math.floor(diffInMin / 60); // Время в часах
    const diffInDay = Math.floor(diffInHour / 24); // Время в днях
    const diffInMonth = Math.floor(diffInDay / 30); // Время в месяцах
    const diffInYear = Math.floor(diffInMonth / 12); // Время в годах

    // Возвращаем строку, основанную на разнице во времени
    if (diffInSec < 60) {
      return diffInSec <= 1 ? "Момент назад" : `${diffInSec} секунд назад`;
    } else if (diffInMin < 60) {
      return diffInMin === 1 ? "1 минуту назад" : `${diffInMin} минут назад`;
    } else if (diffInHour < 24) {
      return diffInHour === 1 ? "1 час назад" : `${diffInHour} часов назад`;
    } else if (diffInDay < 30) {
      return diffInDay === 1 ? "Вчера" : `${diffInDay} дней назад`;
    } else if (diffInMonth < 12) {
      return diffInMonth === 1
        ? "1 месяц назад"
        : `${diffInMonth} месяцев назад`;
    } else {
      return diffInYear === 1 ? "1 год назад" : `${diffInYear} лет назад`;
    }
  }

  return (
    <View>
      <Text>{timeAgo}</Text>
    </View>
  );
}

export default TimeAgo;
