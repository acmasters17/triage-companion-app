import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginStack from "./LoginStack";
import { useEffect, useState } from "react";
import HomeTabs from "./HomeTabs";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "./theme.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  // run on start up, check labcode and if approved, if both of these are true then progress to home screen
  // if offline this is fine, if online need to check user logged in as well
  useEffect(() => {
    const getSignedInRequirements = async () => {
      try {
        const labName = await AsyncStorage.getItem("lab-name");
        const approved = await AsyncStorage.getItem("lab-approved");
        if (labName !== null) {
          if (approved === "true") {
            // lab name exists and they are approved so allow navigation to home tabs
            // TODO: need to check firebase login later
            console.log("Approved Lab for " + labName);
            setSignedIn(true);
          } else {
            console.log("Lab Code exists but not approved");
            // TODO: navigate to approval screen
          }
        } else {
          console.log("No Lab Code");
        }
      } catch (e) {
        // error reading value
      }
    };

    getSignedInRequirements();
  }, []);

  return (
    <>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          {signedIn === false ? <LoginStack setSignedIn={setSignedIn} /> : <HomeTabs />}
        </NavigationContainer>
      </ApplicationProvider>
      <Toast />
    </>
  );
}
