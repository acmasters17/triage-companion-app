import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Layout, Spinner, Text } from "@ui-kitten/components";
import * as DocumentPicker from "expo-document-picker";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import { getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Toast from "react-native-toast-message";

export default function MyContentSOP() {
  const [isLoading, setIsLoading] = useState(true);
  const [labName, setLabName] = useState("");
  const [currentSOPName, setCurrentSOPName] = useState("");
  const [fileURIToUpload, setFileURIToUpload] = useState("");
  const [fileNameToUpload, setFileNameToUpload] = useState("");
  const functions = getFunctions();

  useEffect(() => {
    //get the current files uploaded name
    const getCurrentUploadedSOPName = async () => {
      setIsLoading(true);
      // Cloud Request to join lab so call an async request
      const requestSOPName = httpsCallable(functions, "getUploadedSOPName");
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        setLabName(loadedLabName);
        try {
          // cloud request to get all users
          const req = await requestSOPName({
            labName: sanitizeLabName(loadedLabName),
          });

          // get users
          const data = req.data as any;
          const sopName = data.sopName as string;

          setCurrentSOPName(sopName);
          console.log(req.data);
        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getCurrentUploadedSOPName();
  }, []);

  const uploadSOP = async (uri: string, name: string) => {
    // uploads new SOP to bucket
    try {
      const storage = getStorage();

      const pathReference = ref(storage, `${sanitizeLabName(labName)}/SOP.pdf`);

      const img = await fetch(uri);
      const blob = await img.blob();

      await uploadBytesResumable(pathReference, blob);
    } catch (e) {
      // if it errors somethings gone wrong with upload
      throwToastError(e);
    }

    // calls function to change new name in firebase doc
    const updateSOPName = httpsCallable(functions, "updateUploadedSOPName");
    try {
      // cloud request to update SOP name
      await updateSOPName({
        labName: sanitizeLabName(labName),
        newSOPName: name,
      });
    } catch (e) {
      throwToastError(e);
    }

    // finish / clear
    setCurrentSOPName(name);
    setFileNameToUpload("");
    setFileURIToUpload("");

    // throw success toast
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: `Your new SOP has been uploaded!`,
      position: "bottom",
    });
  };

  return (
    <Layout style={styles.container}>
      <Text
        category="h6"
        style={{
          marginTop: 20,
          alignSelf: "flex-start",
          marginLeft: 20,
          textAlign: "left",
        }}
      >
        Current SOP
      </Text>
      {isLoading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Spinner />
        </View>
      ) : (
        <Text
          style={{
            marginTop: 20,
            alignSelf: "flex-start",
            marginLeft: 20,
            textAlign: "left",
          }}
        >
          {currentSOPName === ""
            ? "No SOP has been uploaded yet"
            : currentSOPName}
        </Text>
      )}
      <Text
        category="h6"
        style={{
          marginTop: 20,
          alignSelf: "flex-start",
          marginLeft: 20,
          textAlign: "left",
        }}
      >
        Upload SOP
      </Text>

      <Button
        style={{ margin: 20 }}
        onPress={async () => {
          const doc = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
            copyToCacheDirectory: false,
          });
          if (doc.type === "success") {
            setFileNameToUpload(doc.name);
            setFileURIToUpload(doc.uri);
          }
          console.log(doc);
        }}
      >
        Select From Device
      </Button>

      <Text style={{ margin: 20 }}>
        {fileNameToUpload === "" ? "No File Selected" : fileNameToUpload}
      </Text>
      <Button
        style={{ margin: 20 }}
        disabled={fileURIToUpload === ""}
        onPress={() => uploadSOP(fileURIToUpload, fileNameToUpload)}
      >
        Upload
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
