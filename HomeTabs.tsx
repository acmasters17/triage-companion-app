import { StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import KitScreen from "./screens/KitScreen";
import FlashCardScreen from "./screens/FlashCardScreen";
import PDFViewerScreen from "./screens/PDFDisplayerScreen";
import TechnicalTriageChecklistScreen from "./screens/TechnicalTriageChecklistScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Kit Checklist") {
            iconName = "bag-personal";
          } else if (route.name === "Flash Cards") {
            iconName = "cards";
          } else if (route.name === "PDF Viewer") {
            iconName = "notebook";
          } else if (route.name === "Technical Triage Checklist") {
            iconName = "clipboard-check-multiple";
          } else {
            iconName = "account-circle";
          }

          // You can return any component that you like here!
          return <MaterialCommunityIcon name={iconName} size={size} color={color} />;
        },
        headerRight: (props) =>
          route.name === "Profile" ? (
            <></>
          ) : (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                //TODO - Firebase function
                console.log("REFRESHING...");
              }}
            >
              <MaterialIcon name="refresh" color="white" size={26} />
            </TouchableOpacity>
          ),
        headerTitle: "",
        headerStyle: styles.blankHeader,
        tabBarActiveTintColor: "#EFEB8D",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#0C2962" },
      })}
    >
      <Tab.Screen name="Kit Checklist" component={KitScreen} />
      <Tab.Screen name="Flash Cards" component={FlashCardScreen} />
      <Tab.Screen name="PDF Viewer" component={PDFViewerScreen} />
      <Tab.Screen name="Technical Triage Checklist" component={TechnicalTriageChecklistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});
