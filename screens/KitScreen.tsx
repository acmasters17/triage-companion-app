import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/base";

export default function KitScreen() {
  const [kitChecklistItems, setKitChecklistItems] = useState<string[]>([
    "Test",
    "Test 2",
  ]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, true]);
  const [isLoading, setIsLoading] = useState(false);
  const functions = getFunctions();

  // get all users on start up
  useEffect(() => {
    const getChecklistConfig = async () => {
      setIsLoading(true);
      // Cloud Request to join lab so call an async request
      const getKitChecklist = httpsCallable(functions, "getKitChecklist");
      console.log(getKitChecklist)
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        try {
          // cloud request to get checklist
          const req = await getKitChecklist({
            labName: sanitizeLabName(loadedLabName),
          });

          // get checklist
          const data = req.data as any;
          const newKitChecklist = data.kitChecklist as string[];

          setKitChecklistItems(newKitChecklist);
          setCheckedItems(newKitChecklist.map(_ => false));

        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getChecklistConfig();
  }, []);

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );

  return (
    <Layout style={styles.container}>
      <Text
        category="h6"
        style={{
          marginTop: 20,
        }}
      >
        Kit Checklist
      </Text>
      <Text
        category="s1"
        style={{
          marginVertical: 10,
        }}
      >
        Make sure you've got everything before you go
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text category="h6">Items</Text>
        <TouchableOpacity onPress={() => setCheckedItems([false,false])}>
          <View
            style={{
              padding: 10,
              backgroundColor: "#0C2962",
              borderRadius: 10,
            }}
          >
            <MaterialCommunityIcon name="eraser" color="white" size={20} />
          </View>
        </TouchableOpacity>
      </View>
      {kitChecklistItems.length === 0 ? (
        <Text style={{textAlign: "center", margin: 20}}>No items have been set yet! Please contact your head of lab to add items.</Text>
      ) : (
        kitChecklistItems.map((item, key) => (
          <View
            key={key}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems:"center",
              paddingHorizontal: 20,
              paddingVertical: 2
            }}
          >
            <Text category="s1">{item}</Text>
            <CheckBox
              checked={checkedItems[key]}
              onPress={() => setCheckedItems(oldCheckedItems => oldCheckedItems.map((item, index) => index === key ? !oldCheckedItems[key] : item))}
              // Use ThemeProvider to make change for all checkbox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#419488"
            />
          </View>
        ))
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
