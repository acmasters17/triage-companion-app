import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Spinner, Text } from "@ui-kitten/components";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";

type PDFViewerScreenProps = {
  reloadBecauseOfCloud: boolean;
};

export default function PDFViewerScreen(props: PDFViewerScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSOPBlank, setIsSOPBlank] = useState(false);
  const [fileURL, setFileURL] = useState("");

  useEffect(() => {
    const getPDF = async () => {
      setIsLoading(true);
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        const sanitizedLabName = sanitizeLabName(loadedLabName);
        // Create a reference with lab file path
        try {
          const storage = getStorage();

          const pathReference = ref(storage, `${sanitizedLabName}/SOP.pdf`);

          const downloadURL = await getDownloadURL(pathReference);

          setIsSOPBlank(false);
          setFileURL(downloadURL);
        } catch (e) {
          // if it errors SOP does not exist
          setIsSOPBlank(true);
        }
        setIsLoading(false);
      } else {
        throwToastError("No assigned Lab Name - Please contact support");
      }
    };

    getPDF();
  }, [props.reloadBecauseOfCloud]);

  const isFocused = useIsFocused();

  if (isLoading)
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );

  if (isSOPBlank)
    return (
      <View style={styles.container}>
        <Text style={{ padding: 10 }}>
          No SOP has been uploaded yet! Please contact your lab head to upload
          one
        </Text>
      </View>
    );

  return isFocused ? (
    <WebView
      originWhitelist={["*"]}
      source={{ uri: fileURL }}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      startInLoadingState
      pullToRefreshEnabled={true}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      javaScriptCanOpenWindowsAutomatically
      mixedContentMode="always"
      domStorageEnabled={true}
      incognito
    />
  ) : (
    <Text>Not Focused</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
