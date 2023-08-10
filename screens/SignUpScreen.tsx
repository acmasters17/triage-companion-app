import { StyleSheet, View, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utilities/firebaseConfig";
import { Button, Text, Input } from "@ui-kitten/components";
import { throwToastError } from "../utilities/toastFunctions";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log("Registered with:", user.email);
    } catch (e) {
      throwToastError(e);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text category="h5" style={{ textAlign: "center", paddingTop: 20 }}>
        {"Sign Up to DTC!"}
      </Text>
      <Image
        source={require("../assets/DTCLogoNoBackground.png")}
        style={{ height: 100, width: 100 }}
      />
      <View style={{ display: "flex" }}>
        <Input
          label="Email"
          value={email}
          placeholder="evasmith@triage.com"
          onChangeText={(text) => setEmail(text)}
          style={[styles.width80, { paddingVertical: 10 }]}
        />
        <Input
          value={password}
          label="Password"
          placeholder="********"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={[styles.width80, { paddingVertical: 10 }]}
        />
        <Input
          value={password}
          label="Confirm Password"
          placeholder="********"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={[styles.width80, { paddingVertical: 10 }]}
        />
      </View>
      <Button style={styles.width80} onPress={handleSignUp}>
        <Text>Sign Up</Text>
      </Button>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Text>Already got an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontWeight: "bold", color: "#0C2962" }}>Sign in here!</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  width80: {
    width: "80%",
  },
});
