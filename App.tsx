import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import { useState } from "react";
import HomeTabs from "./HomeTabs";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from '@eva-design/eva';
import { default as theme } from './theme.json';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <NavigationContainer>
        {signedIn === false ? <LoginStack /> : <HomeTabs />}
      </NavigationContainer>
    </ApplicationProvider>
  );
}
