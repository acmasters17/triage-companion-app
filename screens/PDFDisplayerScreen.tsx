import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@ui-kitten/components";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PDFViewerProps = {
  uri: string;
};

export default function PDFViewerScreen(props: PDFViewerProps) {
  return props.uri === "" ? (
    <View style={styles.container}>
      <Text>SOP has not been uploaded yet!</Text>
    </View>
  ) : (
    <WebView
      style={styles.container}
      source={{ uri: props.uri }}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode={"always"}
      originWhitelist={['*']}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
