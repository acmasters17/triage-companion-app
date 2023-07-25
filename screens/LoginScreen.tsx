import { StyleSheet, View, KeyboardAvoidingView, Image } from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utilities/firebaseConfig";
import { Button, Text, Input } from "@ui-kitten/components";
import { throwToastError } from "../utilities/toastFunctions";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      console.log("Registered with:", user.email);
    } catch (e) {
      throwToastError(e);
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      console.log("Logged in with:", user.email);
    } catch (e) {
      throwToastError(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={{ paddingTop: 40, textAlign: 'center' }}>
        Welcome to your Digital Triage Companion!
      </Text>
      <Image
        source={require("../assets/DTCLogoNoBackground.png")}
        style={{ height: 200, width: 200, marginVertical: 20 }}
      />
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          value={email}
          placeholder="evasmith@triage.com"
          onChangeText={(text) => setEmail(text)}
          style={{ marginHorizontal: 5, marginVertical: 20 }}
        />
        <Input
          value={password}
          label="Password"
          placeholder="********"
          style={{ marginHorizontal: 5, marginVertical: 20 }}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={{display: "flex", flexDirection: "column", alignItems: "center", width: "80%", marginTop: 20}}>
        <Button style={{ marginHorizontal: 5,marginVertical: 10, width: "100%" }} onPress={handleSignUp}>
          <Text>Sign Up</Text>
        </Button>
        <Text style={{margin: 5}}>Or</Text>
        <Button style={{marginHorizontal: 5,marginVertical: 10, width: "100%" }} onPress={handleSignIn}>
          <Text>Sign In</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
