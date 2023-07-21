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
import { sanitizeLabName } from "./utilities/sanitizer";

const Stack = createNativeStackNavigator();

export default function NavigationScreenManager() {
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [requestBeingMade, setRequestBeingMade] = useState(false);

  // run on start up, check labcode and if approved, if both of these are true then progress to home screen
  // if offline this is fine, if online need to check user logged in as well
  useEffect(() => {
    // add listener to see if firebase has authenticated
    const firebaseSignedIn = onAuthStateChanged(auth, async (user: any) => {
      // if user present
      if (user) {
        try {
          const labName = await AsyncStorage.getItem("lab-name");
          const approved = await AsyncStorage.getItem("lab-approved");
          if (labName !== null) {
            if (approved === "true") {
              // lab name exists and they are approved so allow navigation to home tabs
              navigation.navigate("Home");
            } else {
              console.log("Lab Code exists but not approved");
              // TODO: navigate to approval screen
              navigation.navigate("LabRequested");
            }
          } else {
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
              disabled={requestBeingMade}
              onPress={async () => {
                setRequestBeingMade(true);
                // Cloud Request to join lab so call an async request
                const functions = getFunctions();
                const checkIfLabRequestApproved = httpsCallable(
                  functions,
                  "checkIfLabRequestApproved"
                );

                try {
                  // check if approved
                  const labName = await AsyncStorage.getItem("lab-name");
                  if (labName) {
                    const res = await checkIfLabRequestApproved({
                      labName: sanitizeLabName(labName),
                    });

                    const isApproved = (res.data as any).approved;

                    if (isApproved) {
                      alert(
                        `Congratulations, your request to join lab ${labName} has been approved.`
                      );
                      await AsyncStorage.setItem("lab-approved", "true");
                      navigation.navigate("Home");
                    } else {
                      throwToastError("Sorry, you are still not approved, please try again later!");
                    }
                  }
                } catch (e) {
                  throwToastError(e);
                }
                setRequestBeingMade(false);
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
