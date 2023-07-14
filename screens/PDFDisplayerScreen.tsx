import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@ui-kitten/components";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { ZoomAnimation } from "@ui-kitten/components/ui/animation";

type PDFViewerProps = {
  uri: string;
};

export default function PDFViewerScreen(props: PDFViewerProps) {
  const [loadAgain, setLoadAgain] = useState(false);

  const fileLocation =
    Platform.OS === "ios"
      ? "file:///Users/adammasters/Library/Developer/CoreSimulator/Devices/6818EE0A-3C95-4020-8A46-D5E00F1486FC/data/Containers/Data/Application/B53025A1-D5DA-488B-BE7F-F2041E1CAB7B/Documents/ExponentExperienceData/%2540acmasters%252Ftriage-companion-app/sop.pdf"
      : "file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540acmasters%252Ftriage-companion-app/sop.pdf";


  const webViewRef = React.useRef<WebView>(null);
  const onContentProcessDidTerminate = () => {
    console.log("Content Terminating");
    webViewRef.current?.reload();
  };

  useFocusEffect(() => {
    setLoadAgain(false);
    console.log("Focused so load again");
    setLoadAgain(true)
    
  });
  
  const [renderedOnce, setRenderedOnce] = useState(false);

const updateSource = () => {
    setRenderedOnce(true);
 };

  const isFocused = useIsFocused();

  return isFocused ? (
    <WebView
      originWhitelist={["*"]}
      // source={renderedOnce ? {uri: fileLocation} : undefined}
      source={{uri: "https://expo.dev/"}}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      onLoad={updateSource}
      startInLoadingState
      pullToRefreshEnabled={true}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      javaScriptCanOpenWindowsAutomatically
      mixedContentMode="always"
      domStorageEnabled={true}
      incognito
      onNavigationStateChange={() => console.log("Change")}
      ref={webViewRef}
    />
  ) : (
    <Text>Not Loaded</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
