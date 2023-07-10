import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "@ui-kitten/components";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";

export default function LabLoginScreen() {
  const [requestedlabName, setRequestedLabName] = useState("");
  const [createdlabName, setCreatedLabName] = useState("");
  const [requestBeingMade, setRequestBeingMade] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <Text category="h5">Join Lab</Text>
        <Text style={{ padding: 20 }}>
          If you are not the lab head please refer to them in order to get the
          lab name to join your organisation
        </Text>
        <Input
          label="Lab Name"
          value={requestedlabName}
          placeholder="USW-Cyber-Lab"
          onChangeText={(text) => setRequestedLabName(text)}
          style={{ margin: 20 }}
        />
        <Button
          style={{ width: "70%", marginTop: 15 }}
          disabled={requestBeingMade}
          onPress={async () => {
            setRequestBeingMade(true);
            //TODO: cloud Request to join lab

            //Store Locally
            try {
              await AsyncStorage.setItem("lab-name", requestedlabName);
              await AsyncStorage.setItem("lab-approved", "false");
              navigation.navigate("LabRequested");
            } catch (e) {
              // saving error
              throwToastError(e);
            }
            setRequestBeingMade(false);
          }}
        >
          Request to Join
        </Button>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <Text category="h5">Create Lab</Text>
        <Text style={{ padding: 20 }}>
          If you are the lab head please fill out the form below to create a
          lab!
        </Text>
        <Input
          label="Lab Name"
          value={createdlabName}
          placeholder="USW-New-Cyber-Lab"
          onChangeText={(text) => setCreatedLabName(text)}
          style={{ margin: 20 }}
        />
        <Button
          style={{ width: "70%", marginTop: 15, marginBottom: 80 }}
          disabled={requestBeingMade}
          onPress={async () => {
            setRequestBeingMade(true);
            //Creating a lab so call an async request
            const functions = getFunctions();
            const createLabInCloud = httpsCallable(functions, "createLab");
            try {
              await createLabInCloud({
                labName: sanitizeLabName(createdlabName),
              });

              console.log("Lab Created Success");

              //Store Locally
              try {
                await AsyncStorage.setItem("lab-name", createdlabName);
                await AsyncStorage.setItem("lab-approved", "true");
                navigation.navigate("LabCreated");
              } catch (e) {
                // saving error
                throwToastError(e);
              }
            } catch (e) {
              throwToastError(e);
            }
            setRequestBeingMade(false);
          }}
        >
          Create Lab
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
