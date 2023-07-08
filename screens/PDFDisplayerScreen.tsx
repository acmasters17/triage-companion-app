import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "@ui-kitten/components";
import WebView from "react-native-webview";

export default function PDFViewerScreen() {
  return (
    <WebView style={styles.container} source={{ uri: "https://expo.dev" }} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
