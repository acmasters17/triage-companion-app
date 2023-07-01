import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import LabLoginScreen from "./screens/LabLoginScreen";
import LabCreatedScreen from "./screens/LabCreatedScreen";
import LabRequestedScreen from "./screens/LabRequestedScreen";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: "", headerStyle: styles.blankHeader }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="LabLogin"
        options={{ title: "", headerBackVisible: false, headerStyle: styles.blankHeader }}
        component={LabLoginScreen}
      />
      <Stack.Screen name="LabCreated" component={LabCreatedScreen} />
      <Stack.Screen name="LabRequested" component={LabRequestedScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});
