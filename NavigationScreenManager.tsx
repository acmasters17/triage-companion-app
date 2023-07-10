import { ParamListBase, useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import HomeTabs from "./HomeTabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./utilities/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { throwToastError } from "./utilities/toastFunctions";
import * as SplashScreen from "expo-splash-screen";
import LoginScreen from "./screens/LoginScreen";
import LabLoginScreen from "./screens/LabLoginScreen";
import { StyleSheet } from "react-native";
import LabRequestedScreen from "./screens/LabRequestedScreen";
import { TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { getFunctions, httpsCallable } from "firebase/functions";
import LabCreatedScreen from "./screens/LabCreatedScreen";

const Stack = createNativeStackNavigator();

export default function NavigationScreenManager() {
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  // run on start up, check labcode and if approved, if both of these are true then progress to home screen
  // if offline this is fine, if online need to check user logged in as well
  useEffect(() => {
    console.log("Test");
    // add listener to see if firebase has authenticated
    const firebaseSignedIn = onAuthStateChanged(auth, async (user: any) => {
      console.log("AUTH CHANGE");
      // if user present
      if (user) {
        try {
          const labName = await AsyncStorage.getItem("lab-name");
          const approved = await AsyncStorage.getItem("lab-approved");
          if (labName !== null) {
            if (approved === "true") {
              // lab name exists and they are approved so allow navigation to home tabs
              console.log("Approved Lab for " + labName);
              navigation.navigate("Home");
            } else {
              console.log("Lab Code exists but not approved");
              // TODO: navigate to approval screen
              navigation.navigate("LabRequested");
            }
          } else {
            console.log("No Lab Code");
            // navigato to create a lab screen
            navigation.navigate("LabLogin");
          }
        } catch (e) {
          // error reading value
          // only time when we dont want to load screen as fatal error
          // TODO: May want to have a service down screen
          throwToastError(e);
        }
      } else {
        // user not signed in so allow it to go to login flow
        navigation.navigate("Login");
      }

      //for disabling splash screen on first load
      if (!hasLoadedOnce) {
        console.log("Setting is loaded to true");
        setHasLoadedOnce(true);
        // add small delay to wait for transistion animation before hiding screen
        setTimeout(async () => await SplashScreen.hideAsync(), 500);
      }
    });

    return firebaseSignedIn;
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: "", headerStyle: styles.blankHeader }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="LabLogin"
        options={{
          title: "",
          headerBackVisible: false,
          headerStyle: styles.blankHeader,
        }}
        component={LabLoginScreen}
      />
      <Stack.Screen
        name="LabCreated"
        options={{
          title: "",
          headerBackVisible: false,
          headerStyle: styles.blankHeader,
        }}
      >
        {(navprops: any) => <LabCreatedScreen {...navprops} />}
      </Stack.Screen>
      <Stack.Screen
        name="LabRequested"
        options={{
          title: "",
          headerBackVisible: false,
          headerRight: (props) => (
            <TouchableOpacity
              onPress={async () => {
                //TODO - Firebase function
                console.log("REFRESHING...");

                alert(
                  "Congratulations, your request to join lab TODO:LAB NAME has been approved."
                );
                // set approved to true for test purposes
                try {
                  await AsyncStorage.setItem("lab-approved", "true");
                  navigation.navigate("Home");
                } catch (e) {
                  // saving error
                  throwToastError(e);
                }
              }}
            >
              <MaterialIcon name="refresh" color="white" size={26} />
            </TouchableOpacity>
          ),
          headerStyle: styles.blankHeader,
        }}
        component={LabRequestedScreen}
      />
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeTabs}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});
