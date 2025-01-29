import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import EnhancedImageViewing from "react-native-image-viewing";

export default function AttachedImage({ uri }: { uri: string }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <Image
          source={{ uri: uri }}
          height={330}
          width={330}
          style={{
            width: "100%",

            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
      <EnhancedImageViewing
        images={[{ uri: uri }]}
        imageIndex={0}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)} // Закрытие просмотра
      />
    </View>
  );
}
