import { Redirect, Stack } from "expo-router";

import { useSession } from "../ctx";
import { Text } from "@/components/Themed";
import CustomHeader from "@/components/chat/CustomHeader";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/first_page" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="Search"
        options={{
          presentation: "modal",
          headerStyle: { backgroundColor: currentTheme.menuBackGroundUp },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Username"
        options={{
          presentation: "modal",
          headerStyle: { backgroundColor: currentTheme.menuBackGroundUp },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="(chat)/[username]"
        options={{
          presentation: "fullScreenModal",
          header: ({ route }) => <CustomHeader route={route} />,
        }}
      />
    </Stack>
  );
}
