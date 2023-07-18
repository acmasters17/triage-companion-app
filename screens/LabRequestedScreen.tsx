import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";

export default function LabRequestedScreen() {
  const [storedLabName, setStoredLabName] = useState("Loading");
  useEffect(() => {
    const getLabName = async () => {
      const retrievedlabName = await AsyncStorage.getItem("lab-name");
      if (retrievedlabName) {
        setStoredLabName(retrievedlabName);
      } else {
        throwToastError("Error Lab name not found - please contact support");
      }
    };
    getLabName()
  }, []);
  return (
    <View style={styles.container}>
      <Text category="h5" style={{ paddingTop: 20 }}>
        Request Sent!
      </Text>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ padding: 20 }}>
          {`Your request to join lab ${storedLabName} has been sent!`}
        </Text>
        <MaterialCommunityIcon
          name="email-fast-outline"
          color="black"
          size={100}
        />
        <Text style={{ padding: 20 }}>
          Please now wait until you are approved.
        </Text>
      </View>
      <Text style={{ padding: 20, textAlign: "center" }}>
        You can refresh this page by using the above refresh icon!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
