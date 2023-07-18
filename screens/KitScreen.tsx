import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function KitScreen() {
  const [kitChecklistItems, setKitChecklistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

          console.log(req.data);
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
          marginTop: 10,
        }}
      >
        Make sure you've got everything before you go
      </Text>
      <View>
        <Text>Items</Text>
        <TouchableOpacity>
          <View>
            <MaterialCommunityIcon name="eraser"/>
          </View>
        </TouchableOpacity>
      </View>
      {kitChecklistItems.length === 0 ? (
        <Text>No items have been set yet!</Text>
      ) : (
        kitChecklistItems.map((item, key) => <Text key={key}>{item}</Text>)
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
