import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import LabLoginScreen from "./screens/LabLoginScreen";
import LabCreatedScreen from "./screens/LabCreatedScreen";
import LabRequestedScreen from "./screens/LabRequestedScreen";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LabLogin" component={LabLoginScreen} />
      <Stack.Screen name="LabCreated" component={LabCreatedScreen} />
      <Stack.Screen name="LabRequested" component={LabRequestedScreen} />
    </Stack.Navigator>
  );
}
