import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const CallScreen = ({ roomName }) => {
  const [socket, setSocket] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://10.0.2.2:8000/call/?roomName=${roomName}`);
    setSocket(ws);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection failed");
    };
    ws.onclose = () => console.log("WebSocket closed");

    ws.onmessage = async (event) => {
      try {
        const { audio } = JSON.parse(event.data);
        if (audio) {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: `data:audio/wav;base64,${audio}` });
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
      if (recording) {
        recording.stopAndUnloadAsync().catch((err) => {
          console.error("Error stopping recording on unmount:", err);
        });
      }
    };
  }, [roomName]);

  const recordingOptions = {
    isMeteringEnabled: true, // Включаем анализ уровня громкости
    android: {
      extension: ".wav",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 44100, // Частота дискретизации
      numberOfChannels: 1, // 1 - моно, 2 - стерео
      bitRate: 128000, // 128kbps
    },
    ios: {
      extension: ".wav",
      outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 44100,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16, // 16 бит
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const startRecording = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (recording) return;

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingOptions);
      await rec.startAsync();
      setRecording(rec);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      socket.send(JSON.stringify({ audio: base64 }));
      setRecording(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>Аудиозвонок через WebSocket</Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button
        title="Начать запись"
        onPress={startRecording}
        disabled={recording !== null || isLoading}
      />
      <Button
        title="Остановить запись"
        onPress={stopRecording}
        disabled={recording === null || isLoading}
      />
    </View>
  );
};

export default CallScreen;
