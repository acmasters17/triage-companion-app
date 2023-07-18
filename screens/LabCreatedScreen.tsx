import React, { useEffect, useState } from "react";
import { Button, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";

export default function LabCreatedScreen() {
  const [storedLabName, setStoredLabName] = useState("Loading");
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

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
        Lab Created!
      </Text>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ padding: 20 }}>
          {`Congratulation you have just created ${storedLabName}!`}
        </Text>
        <MaterialCommunityIcon
          name="check-circle-outline"
          color="#41AD49"
          size={200}
        />
        <Text style={{ padding: 20, textAlign: "center" }}>
          Please now click next to progress and begin setting up your lab and
          adding users
        </Text>
      </View>
      <Button
        style={{ width: "60%", marginBottom: 100 }}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        Start
      </Button>
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
