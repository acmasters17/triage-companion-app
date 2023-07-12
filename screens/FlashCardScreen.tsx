import { StyleSheet, View } from "react-native";
import React from "react";
import { Layout, Text } from "@ui-kitten/components";

export default function FlashCardScreen() {
  return (
    <Layout style={styles.container}>
      <Text>Flash card screen currently in development</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
