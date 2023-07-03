import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "@ui-kitten/components";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function LabLoginScreen() {
  const [labName, setLabName] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{width: "100%", display: "flex", alignItems: "center", paddingVertical: 20}}>
        <Text category="h5">Join Lab</Text>
        <Text style={{padding: 20}}>
          If you are not the lab head please refer to them in order to get the lab name to join your
          organisation
        </Text>
        <Input
          label="Lab Name"
          value={labName}
          placeholder="USW-Cyber-Lab"
          onChangeText={(text) => setLabName(text)}
          style={{ margin: 20 }}
        />
        <Button style={{ width: "70%", marginTop: 15 }} onPress={() => navigation.navigate("LabRequested")}>Request to Join</Button>
      </View>
      <View style={{width: "100%", display: "flex", alignItems: "center", paddingVertical: 20}}>
        <Text category="h5">Create Lab</Text>
        <Text style={{padding: 20}}>If you are the lab head please fill out the form below to create a lab!</Text>
        <Input
          label="Lab Name"
          value={labName}
          placeholder="USW-New-Cyber-Lab"
          onChangeText={(text) => setLabName(text)}
          style={{ margin: 20 }}
        />
        <Button style={{ width: "70%", marginTop: 15, marginBottom:80 }} onPress={() => navigation.navigate("LabCreated")}>Create Lab</Button>
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
