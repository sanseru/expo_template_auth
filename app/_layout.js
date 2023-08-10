import { Slot } from "expo-router";
import { Provider } from "./context/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function Root() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Provider>
        <Slot />
      </Provider>
    </ThemeProvider>
  );
}
