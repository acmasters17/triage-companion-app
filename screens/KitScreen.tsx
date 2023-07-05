import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "@ui-kitten/components";

export default function KitScreen() {
  return (
    <View style={styles.container}>
      <Text>Kit screen currently in development</Text>
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
