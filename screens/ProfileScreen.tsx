import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "@ui-kitten/components";
import { auth } from "../utilities/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile screen currently in development</Text>
      <Button
        style={{ marginTop: 20 }}
        status="warning"
        onPress={async () => {
          try {
            await AsyncStorage.setItem("lab-name", "");
            await AsyncStorage.setItem("lab-approved", "false");
            auth.signOut();
          } catch (e) {
            // saving error
            throwToastError(e);
          }
        }}
      >
        Complete Cache Clear Sign Out
      </Button>
      <Button
        style={{ marginTop: 20 }}
        status="danger"
        onPress={() => auth.signOut()}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
