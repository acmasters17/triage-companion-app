import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "@ui-kitten/components";
import { auth } from "../utilities/firebaseConfig";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile screen currently in development</Text>
      <Button style={{marginTop: 20}} status="danger" onPress={() => auth.signOut()}>Sign Out</Button>
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
