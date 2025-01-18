import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import api from "@/api/api";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";
import { useSession } from "@/app/ctx";

const ChangeProfileImage = ({ username }) => {
  const { signOut, session } = useSession();
  const [selectedImage, setSelectedImage] = useState(null);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Разрешение на доступ к галерее требуется для выбора фото.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      console.log("Выбранное изображение URI:", result.assets[0].uri); // Отладка пути
      setSelectedImage(result.assets[0].uri);
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const res = await api({
        method: "POST",
        url: "http://10.0.2.2:8000/api/update/",
        data: {
          type: "avatar",
          avatar: base64,
          username,
        },
      });
      signOut();
    }
  };

  return (
    <>
      {!selectedImage ? (
        // <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        //   <Text style={styles.buttonText}>Выбрать фото</Text>
        // </TouchableOpacity>
        <TouchableWithoutFeedback onPress={handleImagePicker}>
          <View
            style={{
              backgroundColor: currentTheme.system,
              borderRadius: 90,
              padding: 10,
              position: "absolute",
              right: 10,
              bottom: 5,
            }}
          >
            <FontAwesome name="camera" size={23} color="#fff" />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
            onError={(e) =>
              console.log("Ошибка загрузки изображения:", e.nativeEvent.error)
            }
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.cancelButtonText}>Отменить</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    alignItems: "center",
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangeProfileImage;
