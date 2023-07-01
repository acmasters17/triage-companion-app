import { StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { auth } from "../utilities/firebaseConfig";
import { Button, Text, Input } from "@ui-kitten/components";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const firebaseAuthListener = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        navigation.navigate("LabLogin");
      }
    });

    return firebaseAuthListener;
  }, []);

  const handleSignUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log("Registered with:", user.email);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text category="h3" style={{ paddingTop: 20 }}>
        Welcome!
      </Text>
      <Text style={{ paddingVertical: 20 }}>Logo</Text>
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

      <Button style={{ width: "80%", marginBottom: 100 }} onPress={handleSignUp}>
        <Text>Sign Up</Text>
      </Button>
    </KeyboardAvoidingView>
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
