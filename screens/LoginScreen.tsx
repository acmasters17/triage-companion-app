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
      <Text category="h5" style={{ paddingTop: 20 }}>
        Welcome to your DTC!
      </Text>
      <Image
        source={require("../assets/DTCLogoNoBackground.png")}
        style={{ height: 200, width: 200 }}
      />
      <View style={styles.inputContainer}>
        <Input
          label="Email"
          value={email}
          placeholder="evasmith@triage.com"
          onChangeText={(text) => setEmail(text)}
          style={{ margin: 5 }}
        />
        <Input
          value={password}
          label="Password"
          placeholder="********"
          style={{ margin: 5 }}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button style={{ width: "80%" }} onPress={handleSignUp}>
        <Text>Sign Up</Text>
      </Button>
      <Button style={{ width: "80%", marginBottom: 50 }} onPress={handleSignIn}>
        <Text>Sign In</Text>
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
