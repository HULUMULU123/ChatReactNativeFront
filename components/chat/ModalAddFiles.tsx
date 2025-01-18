import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Button,
  Dimensions,
  Easing,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGlobal from "@/constants/global";

import FlashMessage, { showMessage } from "react-native-flash-message";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";

const { height } = Dimensions.get("window");
export default function ModalAddFiles() {
  const { username } = useLocalSearchParams();
  const [showAddFiles, setShowAddFiles] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const getFileUris = useGlobal((state) => state.getFileUris);
  const slideAnim = useRef(new Animated.Value(height)).current; // Начальная позиция окна
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const showFilesToast = (msg, desc, tp) => {
    showMessage({
      message: msg,
      description: desc,
      type: tp,
      duration: 3000,
      backgroundColor: "red",
      color: "white",
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,

      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets) {
      const pickedFile = result.assets[0];
      const fileUri = pickedFile.uri;

      // Сохранение пути в AsyncStorage
      try {
        const existingPaths = await AsyncStorage.getItem(
          `@files_uri_${username}`
        );
        const pathsArray = existingPaths ? JSON.parse(existingPaths) : [];
        if (pathsArray.length == 0) {
          pathsArray.push(fileUri);
          await AsyncStorage.setItem(
            `@files_uri_${username}`,
            JSON.stringify(pathsArray)
          );
          console.log("File path saved:", fileUri);
          getFileUris(username);
        } else {
          showFilesToast(
            "Error",
            "Now you can select only one file",
            "default"
          );
        }
      } catch (error) {
        console.error("Error saving file path", error);
      }
    }

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true, // Save a temporary copy for access
      });

      if (!result.canceled && result.assets) {
        const pickedFile = result.assets[0];
        const fileUri = pickedFile.uri;

        // Сохранение пути в AsyncStorage
        try {
          const existingPaths = await AsyncStorage.getItem(
            `@files_uri_${username}`
          );
          const pathsArray = existingPaths ? JSON.parse(existingPaths) : [];
          pathsArray.push(fileUri);
          await AsyncStorage.setItem(
            `@files_uri_${username}`,
            JSON.stringify(pathsArray)
          );
          console.log("File path saved:", fileUri);
          getFileUris(username);
        } catch (error) {
          console.error("Error saving file path", error);
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };
  const openModal = () => {
    setShowAddFiles(true);
    Animated.timing(slideAnim, {
      toValue: 200, // Сдвиг до половины экрана
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Сдвиг за пределы экрана
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowAddFiles(false));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={openModal}>
        <FontAwesome name="paperclip" size={25} color={currentTheme.infoText} />
      </TouchableWithoutFeedback>
      {showAddFiles && (
        <Modal transparent visible={showAddFiles} animationType="fade">
          <View style={styles.modalOverlay}>
            {/* Затемненный фон */}
            <TouchableOpacity style={styles.overlay} onPress={closeModal} />
            {/* Выпадающее окно */}
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
                { backgroundColor: currentTheme.blockBackground },
              ]}
            >
              <Text style={[styles.modalText, { color: currentTheme.text }]}>
                Here you can attach file!
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <TouchableWithoutFeedback onPress={pickImage}>
                  <View style={{ alignItems: "center" }}>
                    <FontAwesome
                      name="photo"
                      size={25}
                      color="#fff"
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 100,
                        backgroundColor: currentTheme.menuBackGroundUp,
                      }}
                    />

                    <Text style={{ color: currentTheme.text }}>Photo</Text>
                  </View>
                </TouchableWithoutFeedback>
                {/* <Button
                  title="Pick an image from camera roll"
                  onPress={pickImage}
                /> */}
                <TouchableWithoutFeedback onPress={pickDocument}>
                  <View style={{ alignItems: "center" }}>
                    <FontAwesome
                      name="file"
                      size={25}
                      color="#fff"
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 100,
                        backgroundColor: currentColors.nameColor,
                      }}
                    />

                    <Text style={{ color: currentTheme.text }}>File</Text>
                  </View>
                </TouchableWithoutFeedback>
                {/* <Button title="Pick a Document" onPress={pickDocument} /> */}
              </View>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: currentTheme.brand }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Затемнение фона
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    height: height / 2, // Половина экрана

    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
