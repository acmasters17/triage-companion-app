import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  ListItem,
  Layout,
  Spinner,
  Text,
} from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import {
  throwToastError,
  throwToastSuccess,
} from "../utilities/toastFunctions";
import { Dialog } from "@rneui/base";

export default function MyContentFlashCards() {
  const [flashCardItems, setFlashCardItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestBeingMade, setRequestBeingMade] = useState(false);
  const [addEditDialogVisible, setAddEditDialogVisible] = useState(false);
  const [labName, setLabName] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingMode, setEditingMode] = useState<"Add" | "Edit">("Add");
  const functions = getFunctions();

  //  get current config on start up
  useEffect(() => {
    const getFlashCardsConfig = async () => {
      setIsLoading(true);
      const getFlashCards = httpsCallable(functions, "getFlashCards");
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        setLabName(loadedLabName);
        try {
          // cloud request to get flashcards
          const req = await getFlashCards({
            labName: sanitizeLabName(loadedLabName),
          });

          // get clouded flash cards
          const data = req.data as any;
          const cloudFlashCards = data.flashCards as string[];

          setFlashCardItems(cloudFlashCards);
        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getFlashCardsConfig();
  }, []);

  const openDialog = (mode: "Add" | "Edit", index: number, value: string) => {
    setEditingMode(mode);
    setEditingIndex(index);
    setEditingValue(value);
    setAddEditDialogVisible(true);
  };

  const saveDialogChanges = () => {
    if (editingMode === "Add") {
      // add new value to array
      setFlashCardItems((oldItems) => oldItems.concat([editingValue]));
    } else {
      // modify value at index
      setFlashCardItems((oldItems) =>
        oldItems.map((oldItem, oldIndex) =>
          oldIndex === editingIndex ? editingValue : oldItem
        )
      );
    }

    // then call close dialog
    closeDialog();
  };

  const closeDialog = () => {
    setEditingValue("");
    setEditingIndex(-1);
    setAddEditDialogVisible(false);
  };

  const saveChangesInCloudButton = async () => {
    setRequestBeingMade(true);
    const updateFlashCards = httpsCallable(functions, "updateFlashCards");
    try {
      await updateFlashCards({
        labName: sanitizeLabName(labName),
        newFlashCards: flashCardItems,
      });
      throwToastSuccess(`Your new Flash Cards have been uploaded.`);
    } catch (e) {
      throwToastError(e);
    }
    setRequestBeingMade(false);
  };

  const renderEditDeleteButtons = (item: string, index: number) => (
    <>
      <Button
        size="tiny"
        status="info"
        style={{ marginRight: 5 }}
        onPress={() => openDialog("Edit", index, item)}
        disabled={requestBeingMade}
      >
        Edit
      </Button>
      <Button
        size="tiny"
        status="danger"
        disabled={requestBeingMade}
        onPress={() =>
          setFlashCardItems((oldItems) =>
            oldItems.filter((oldi) => oldi !== item)
          )
        }
      >
        Delete
      </Button>
    </>
  );

  return (
    <Layout style={styles.container}>
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          padding: 20,
          alignItems: "center",
        }}
      >
        <Text category="h6">Current Flash Cards</Text>
        <Button onPress={saveChangesInCloudButton} disabled={requestBeingMade}>
          Save
        </Button>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text category="h6">Cards</Text>
      </View>
      <ScrollView style={{ margin: 20 }}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner />
          </View>
        ) : (
          <>
            {flashCardItems.length === 0 ? (
              <Text style={{ textAlign: "center", margin: 20 }}>
                No flash cards have been set yet!
              </Text>
            ) : (
              flashCardItems.map((item, key) => (
                <ListItem
                  key={key}
                  style={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
                  title={item}
                  accessoryRight={() => renderEditDeleteButtons(item, key)}
                  disabled={requestBeingMade}
                />
              ))
            )}
            <ListItem
              disabled
              accessoryRight={() => (
                <Button
                  size="small"
                  status="success"
                  style={{ marginVertical: 5 }}
                  onPress={() => openDialog("Add", -1, "")}
                  disabled={requestBeingMade}
                >
                  Add
                </Button>
              )}
            />
          </>
        )}
      </ScrollView>
      <Dialog
        isVisible={addEditDialogVisible}
        onBackdropPress={closeDialog}
        overlayStyle={{ borderRadius: 10, backgroundColor: "white" }}
      >
        <Dialog.Title
          titleStyle={{ margin: 10 }}
          title={editingMode === "Add" ? "Add" : "Edit"}
        />
        <Input
          label="Flash Card"
          value={editingValue}
          placeholder="e.g Is the device related to the suspected offence?"
          onChangeText={(text) => setEditingValue(text)}
          style={{ marginHorizontal: 10, marginVertical: 20 }}
          multiline
          blurOnSubmit
        />
        <Dialog.Actions>
          <Button
            size="small"
            onPress={saveDialogChanges}
            status="success"
            style={{ marginHorizontal: 10 }}
          >
            {editingMode === "Add" ? "Add" : "Save"}
          </Button>
          <Button size="small" onPress={closeDialog} status="danger">
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
