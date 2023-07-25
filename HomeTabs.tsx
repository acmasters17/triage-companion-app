import { StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import KitScreen from "./screens/KitScreen";
import FlashCardScreen from "./screens/FlashCardScreen";
import PDFViewerScreen from "./screens/PDFDisplayerScreen";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileStack from "./ProfileStack";
import { getFunctions, httpsCallable } from "firebase/functions";
import { throwToastError, throwToastSuccess } from "./utilities/toastFunctions";
import { sanitizeLabName } from "./utilities/sanitizer";
import TTCStack from "./screens/TTCStack";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const [newConfigsLoading, setNewConfigsLoading] = useState(false);
  const [reloadTabs, setReloadTabs] = useState(false);
  const [loadedLabName, setLoadedLabName] = useState("");
  const functions = getFunctions();

  useEffect(() => {
    const getLabNameFromStorage = async () => {
      const newLabName = await AsyncStorage.getItem("lab-name");
      if (newLabName) {
        setLoadedLabName(newLabName);
      } else {
        throwToastError("Stored lab name not found - please contact support");
      }
    };

    getLabNameFromStorage();
  }, []);

  const getAllConfigs = async () => {
    setNewConfigsLoading(true);
    await getKitCheckListConfig();
    await getFlashCardsConfig();
    setNewConfigsLoading(false);
    setReloadTabs(!reloadTabs);
    throwToastSuccess("New content has been downloaded.");
  };

  const getKitCheckListConfig = async () => {
    // Cloud Request get checklist content
    const getKitChecklist = httpsCallable(functions, "getKitChecklist");
    try {
      // cloud request to get checklist
      const req = await getKitChecklist({
        labName: sanitizeLabName(loadedLabName),
      });

      // get checklist
      const data = req.data as any;
      const newKitChecklist = data.kitChecklist as string[];

      AsyncStorage.setItem("kitChecklist", JSON.stringify(newKitChecklist));
    } catch (e) {
      throwToastError(e);
    }
  };

  const getFlashCardsConfig = async () => {
    // Cloud Request to get flashcards content
    const getFlashCards = httpsCallable(functions, "getFlashCards");
    try {
      // cloud request to get flashcards
      const req = await getFlashCards({
        labName: sanitizeLabName(loadedLabName),
      });

      // get flashcards from data sent back
      const data = req.data as any;
      const newFlashCards = data.flashCards as string[];

      AsyncStorage.setItem("flashCards", JSON.stringify(newFlashCards));
    } catch (e) {
      throwToastError(e);
    }
  };


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
          return (
            <MaterialCommunityIcon name={iconName} size={size} color={color} />
          );
        },
        headerRight: (props) =>
          route.name === "Profile" ? (
            <></>
          ) : (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={getAllConfigs}
              disabled={newConfigsLoading}
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
      <Tab.Screen name="Kit Checklist">
        {() => <KitScreen reloadBecauseOfCloud={reloadTabs} />}
      </Tab.Screen>
      <Tab.Screen name="Flash Cards">
        {() => <FlashCardScreen reloadBecauseOfCloud={reloadTabs} />}
      </Tab.Screen>
      <Tab.Screen name="PDF Viewer">
        {() => <PDFViewerScreen reloadBecauseOfCloud={reloadTabs} />}
      </Tab.Screen>
      <Tab.Screen
        name="Technical Triage Checklist"
        options={{ headerShown: false }}
      >
        {() => (
          <TTCStack
            getAllConfigs={getAllConfigs}
            newConfigsLoading={newConfigsLoading}
            reloadBecauseOfCloud={reloadTabs}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  blankHeader: {
    backgroundColor: "#0C2962",
  },
});
