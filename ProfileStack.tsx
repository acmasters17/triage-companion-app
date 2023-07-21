import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import ProfileScreen from "./screens/ProfileScreen";
import MyLabScreen from "./screens/MyLabScreen";
import MyContentSOP from "./screens/MyContentSOP";
import MyContentHome from "./screens/MyContentHome";
import MyContentKit from "./screens/MyContentKit";
import MyContentFlashCards from "./screens/MyContentFlashCards";

const Stack = createNativeStackNavigator();

export default function NavigationScreenManager() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: "", headerStyle: styles.blankHeader }}
        name="HomeProfile"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={genericBackHeader}
        name="MyLab"
        component={MyLabScreen}
      />
      <Stack.Screen
        options={genericBackHeader}
        name="MyContentHome"
        component={MyContentHome}
      />
      <Stack.Screen
        options={genericBackHeader}
        name="MyContentKit"
        component={MyContentKit}
      />
      <Stack.Screen
        options={genericBackHeader}
        name="MyContentFlashCards"
        component={MyContentFlashCards}
      />
      <Stack.Screen
        options={genericBackHeader}
        name="MyContentSOP"
        component={MyContentSOP}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});

const genericBackHeader = {
  title: "",
  headerStyle: styles.blankHeader,
  headerTintColor: "white",
};
