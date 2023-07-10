import { NavigationContainer } from "@react-navigation/native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "./theme.json";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import NavigationScreenManager from "./NavigationScreenManager";

// Keep the splash screen visible until navigation decides
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <NavigationScreenManager />
        </NavigationContainer>
      </ApplicationProvider>
      <Toast />
    </>
  );
}
