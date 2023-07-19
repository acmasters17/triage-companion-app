import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/base";

type KitScreenProps = {
  reloadBecauseOfCloud: boolean
}

export default function KitScreen(props:KitScreenProps) {
  const [kitChecklistItems, setKitChecklistItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  

  // get loaded checklist
  useEffect(() => {
    const getChecklistConfig = async () => {
      setIsLoading(true);
      const loadedChecklist = await AsyncStorage.getItem("kitChecklist");
      if (loadedChecklist) {
        try {
          //parsing it
          const newKitChecklist = JSON.parse(loadedChecklist) as string[];

          setKitChecklistItems(newKitChecklist);
          setCheckedItems(newKitChecklist.map(_ => false));

        } catch (e) {
          throwToastError("No Checklist has been set yet");
        }
      }
      setIsLoading(false);
    };

    getChecklistConfig();
  }, [props.reloadBecauseOfCloud]);

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
        <TouchableOpacity onPress={() => setCheckedItems(oldItems => oldItems.map(_ => false))}>
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
