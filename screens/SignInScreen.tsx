import { StyleSheet, KeyboardAvoidingView, Image, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utilities/firebaseConfig";
import { Button, Text } from "@ui-kitten/components";
import { throwToastError } from "../utilities/toastFunctions";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Input } from "@rneui/base";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSignIn = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log("Logged in with:", user.email);
    } catch (e) {
      throwToastError(e);
    }
  };

  const validateEmail = () => {
    if (email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      // good email
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email!");
    }
  };

  const validatePassword = () => {
    if (password.length >= 8) {
      // good password
      setPasswordError("");
    } else {
      setPasswordError("Please ensure your password is greater than 8 characters in length!");
    }
  };

  const signUpDisabled = () => {
    if (password.length >= 8 && email.length > 1 && emailError === "") {
      // all good
      return false;
    } else {
      // issue
      return true;
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text category="h5" style={{ textAlign: "center", paddingTop: 20 }}>
        {"Welcome to your\nDigital Triage Companion!"}
      </Text>
      <Image
        source={require("../assets/DTCLogoNoBackground.png")}
        style={{ height: 150, width: 150 }}
      />
      <View style={{ display: "flex", width: "80%" }}>
        <Input
          label="Email"
          value={email}
          placeholder="evasmith@triage.com"
          onChangeText={setEmail}
          clearTextOnFocus={false}
          style={{ paddingVertical: 10 }}
          errorMessage={emailError}
          onEndEditing={() => validateEmail()}
          errorStyle={{ paddingBottom: 10 }}
        />
        <Input
          value={password}
          label="Password"
          placeholder="********"
          secureTextEntry
          clearTextOnFocus={true}
          onChangeText={setPassword}
          style={{ paddingVertical: 10 }}
          errorMessage={passwordError}
          onEndEditing={() => validatePassword()}
          errorStyle={{ paddingBottom: 10 }}
        />
      </View>
      <Button style={styles.width80} onPress={handleSignIn} disabled={signUpDisabled()}>
        <Text>Sign In</Text>
      </Button>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Text>Not got an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ fontWeight: "bold", color: "#0C2962" }}>Sign up here!</Text>
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
