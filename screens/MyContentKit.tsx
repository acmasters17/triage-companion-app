import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input,ListItem, Layout, Spinner, Text } from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MyContentKit() {
  const [kitChecklistItems, setKitChecklistItems] = useState<string[]>([
    "test 1",
    "test 2",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const functions = getFunctions();

  //   // get current config on start up
  //   useEffect(() => {
  //     const getChecklistConfig = async () => {
  //       setIsLoading(true);
  //       // Cloud Request to join lab so call an async request
  //       const getKitChecklist = httpsCallable(functions, "getKitChecklist");
  //       const loadedLabName = await AsyncStorage.getItem("lab-name");
  //       if (loadedLabName) {
  //         try {
  //           // cloud request to get checklist
  //           const req = await getKitChecklist({
  //             labName: sanitizeLabName(loadedLabName),
  //           });

  //           // get checklist
  //           const data = req.data as any;
  //           const newKitChecklist = data.kitChecklist as string[];

  //           setKitChecklistItems(newKitChecklist);

  //         } catch (e) {
  //           throwToastError(e);
  //         }
  //       }
  //       setIsLoading(false);
  //     };

  //     getChecklistConfig();
  //   }, []);

  const renderEditDeleteButtons = (item: string) => (
    <>
      <Button
        size="tiny"
        status="info"
        style={{ marginRight: 5 }}
    
        onPress={() => console.log("Edit")}
      >
        Edit
      </Button>
      <Button
        size="tiny"
        status="danger"
        onPress={() => console.log("delete")}
      >
        Delete
      </Button>
    </>
  );

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );

  return (
    <Layout style={styles.container}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          padding: 20,
          alignItems: "center",
        }}
      >
        <Text category="h6">Current Kit Checklist</Text>
        <Button>Save</Button>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text category="h6">Items</Text>
       
      </View>
      <ScrollView style={{margin: 20}}>
      {kitChecklistItems.length === 0 ? (
        <Text style={{ textAlign: "center", margin: 20 }}>
          No items have been set yet!
        </Text>
      ) : (
        kitChecklistItems.map((item, key) => (
            <ListItem
              key={key}
              style={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
              title={item}
              accessoryRight={() => renderEditDeleteButtons(item)}
            />
        ))
      )}

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
