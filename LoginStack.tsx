import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import LabLoginScreen from "./screens/LabLoginScreen";
import LabCreatedScreen from "./screens/LabCreatedScreen";
import LabRequestedScreen from "./screens/LabRequestedScreen";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

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
      <Stack.Screen
        name="LabCreated"
        options={{ title: "", headerBackVisible: false, headerStyle: styles.blankHeader }}
        component={LabCreatedScreen}
      />
      <Stack.Screen
        name="LabRequested"
        options={{
          title: "",
          headerBackVisible: false,
          headerRight: (props) => <TouchableOpacity onPress={() => {
            //TODO - Firebase function
            console.log("REFRESHING...")
          }}><MaterialIcon name="refresh" color="white" size={26}/></TouchableOpacity>,
          headerStyle: styles.blankHeader,
        }}
        component={LabRequestedScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});
