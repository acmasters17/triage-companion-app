import { StyleSheet, View, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utilities/firebaseConfig";
import { Button, Text } from "@ui-kitten/components";
import { throwToastError } from "../utilities/toastFunctions";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Input } from "@rneui/base";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, newPassword);
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

  const validateNewPassword = () => {
    if (newPassword.length >= 8) {
      // good password
      setNewPasswordError("");
    } else {
      setNewPasswordError("Please ensure your password is greater than 8 characters in length!");
    }
  };

  const validateConfirmPassword = () => {
    if (newPassword === confirmPassword) {
      // matching passwords
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("Please ensure your passwords match!");
    }
  };

  const signUpDisabled = () => {
    if (
      newPassword.length >= 8 &&
      newPassword === confirmPassword &&
      email.length > 1 &&
      emailError === ""
    ) {
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
        {"Sign Up to DTC!"}
      </Text>
      <Image
        source={require("../assets/DTCLogoNoBackground.png")}
        style={{ height: 100, width: 100 }}
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
          value={newPassword}
          label="New Password"
          placeholder="********"
          secureTextEntry
          clearTextOnFocus={true}
          onChangeText={setNewPassword}
          style={{ paddingVertical: 10 }}
          errorMessage={newPasswordError}
          onEndEditing={() => validateNewPassword()}
          errorStyle={{ paddingBottom: 10 }}
        />
        <Input
          value={confirmPassword}
          label="Confirm Password"
          placeholder="********"
          secureTextEntry
          clearTextOnFocus={true}
          onChangeText={setConfirmPassword}
          style={{ paddingVertical: 10 }}
          errorMessage={confirmPasswordError}
          onEndEditing={() => validateConfirmPassword()}
          errorStyle={{ paddingBottom: 10 }}
        />
      </View>
      <Button style={styles.width80} onPress={handleSignUp} disabled={signUpDisabled()}>
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
