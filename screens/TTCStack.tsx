import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity } from "react-native";
import TTCHomeScreen from "./TTCHomeScreen";
import TTCCategoryScreen from "./TTCCategoryScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const Stack = createNativeStackNavigator();

type TTCStackProps = {
  getAllConfigs: () => Promise<void>;
  newConfigsLoading: boolean;
  reloadBecauseOfCloud: boolean;
};

type Category = {
  categoryName: string;
  list: string[];
};

export default function TTCStack(props: TTCStackProps) {
  const [technicalTriageChecklistItems, setTechnicalTriageChecklistItems] =
    useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chosenIndex, setChosenIndex] = useState(0);

  // get loaded checklist
  useEffect(() => {
    const getChecklistConfig = async () => {
      setIsLoading(true);
      const loadedChecklist = await AsyncStorage.getItem(
        "technicalTriageChecklist"
      );
      if (loadedChecklist) {
        try {
          //parsing it
          const newTechnicalTriageChecklist = JSON.parse(
            loadedChecklist
          ) as Category[];

          setTechnicalTriageChecklistItems(newTechnicalTriageChecklist);
        } catch (e) {
          throwToastError("No Checklist has been set yet");
        }
      }
      setIsLoading(false);
    };

    getChecklistConfig();
  }, [props.reloadBecauseOfCloud]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: (navprops) => (
          <TouchableOpacity
           
            onPress={props.getAllConfigs}
            disabled={props.newConfigsLoading}
          >
            <MaterialIcon name="refresh" color="white" size={26} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        options={{ title: "", headerStyle: styles.blankHeader }}
        name="TTCHome"
      >
        {() => (
          <TTCHomeScreen
            isLoading={isLoading}
            categories={technicalTriageChecklistItems}
          />
        )}
      </Stack.Screen>
      <Stack.Screen options={genericBackHeader} name="TTCCategory">
        {() => (
          <TTCCategoryScreen
            isLoading={isLoading}
            categoryName={
              technicalTriageChecklistItems[chosenIndex].categoryName
            }
            checkListItems={technicalTriageChecklistItems[chosenIndex].list}
          />
        )}
      </Stack.Screen>
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
