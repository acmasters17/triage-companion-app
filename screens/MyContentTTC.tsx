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
import { Category } from "../utilities/categoriesModel";

export default function MyContentTTC() {
  const [TTCItems, setTTCItems] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestBeingMade, setRequestBeingMade] = useState(false);
  const [addEditDialogVisible, setAddEditDialogVisible] = useState(false);
  const [labName, setLabName] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [addionalEditingIndex, setAddionalEditingIndex] = useState(-1);
  const [editingMode, setEditingMode] = useState<
    "Add Category" | "Add Item" | "Edit Category" | "Edit Item"
  >("Add Category");
  const functions = getFunctions();

  // get current config on start up
  useEffect(() => {
    const getChecklistConfig = async () => {
      setIsLoading(true);
      // Cloud Request to join lab so call an async request
      const getTTCChecklist = httpsCallable(functions, "getTTChecklist");
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        setLabName(loadedLabName);
        try {
          // cloud request to get checklist
          const req = await getTTCChecklist({
            labName: sanitizeLabName(loadedLabName),
          });

          // get checklist
          const data = req.data as any;
          const newTTCChecklist = data.technicalTriageChecklist as Category[];

          setTTCItems(newTTCChecklist);
        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getChecklistConfig();
  }, []);

  const openDialog = (
    mode: "Add Category" | "Add Item" | "Edit Category" | "Edit Item",
    firstIndex: number,
    secondIndex: number,
    value: string
  ) => {
    setEditingMode(mode);
    setEditingIndex(firstIndex);
    setAddionalEditingIndex(secondIndex);
    setEditingValue(value);
    setAddEditDialogVisible(true);
  };

  const saveDialogChanges = () => {
    if (editingMode === "Add Category") {
      // add new category to array
      setTTCItems((oldItems) =>
        oldItems.concat([{ categoryName: editingValue, list: [] }])
      );
    } else if (editingMode === "Add Item") {
      setTTCItems((oldItems) =>
        oldItems.map((oldItem, oldIndex) =>
          oldIndex === editingIndex
            ? {
                categoryName: oldItem.categoryName,
                list: oldItem.list.concat([editingValue]),
              }
            : oldItem
        )
      );
    } else if (editingMode === "Edit Category") {
      // modify value at index
      setTTCItems((oldItems) =>
        oldItems.map((oldItem, oldIndex) =>
          oldIndex === editingIndex
            ? { categoryName: editingValue, list: oldItem.list }
            : oldItem
        )
      );
    } else {
      // modify value at index and addional index
      setTTCItems((oldItems) =>
        oldItems.map((oldItem, oldIndex) =>
          oldIndex === editingIndex
            ? {
                categoryName: oldItem.categoryName,
                list: oldItem.list.map((innerOldListItem, innerOldListIndex) =>
                  innerOldListIndex === addionalEditingIndex
                    ? editingValue
                    : innerOldListItem
                ),
              }
            : oldItem
        )
      );
    }

    // then call close dialog
    closeDialog();
  };

  const closeDialog = () => {
    setEditingValue("");
    setEditingIndex(-1);
    setAddionalEditingIndex(-1);
    setAddEditDialogVisible(false);
  };

  const saveChangesInCloudButton = async () => {
    setRequestBeingMade(true);
    const updateTTChecklist = httpsCallable(functions, "updateTTChecklist");
    try {
      // cloud request to update TTC checklist
      await updateTTChecklist({
        labName: sanitizeLabName(labName),
        newTechnicalTriageChecklist: TTCItems,
      });

      throwToastSuccess(
        `Your new Technical Triage Checklist has been uploaded.`
      );
    } catch (e) {
      throwToastError(e);
    }
    setRequestBeingMade(false);
  };

  const renderItemEditDeleteButtons = (
    item: string,
    innerIndex: number,
    outerIndex: number
  ) => (
    <>
      <Button
        size="tiny"
        status="info"
        style={{ marginRight: 5 }}
        onPress={() => openDialog("Edit Item", outerIndex, innerIndex, item)}
        disabled={requestBeingMade}
      >
        Edit
      </Button>
      <Button
        size="tiny"
        status="danger"
        disabled={requestBeingMade}
        onPress={() =>
          setTTCItems((oldItems) =>
            oldItems.map((oldItem, oldIndex) =>
              oldIndex === outerIndex
                ? {
                    categoryName: oldItem.categoryName,
                    list: oldItem.list.filter((oldi) => oldi !== item),
                  }
                : oldItem
            )
          )
        }
      >
        Delete
      </Button>
    </>
  );

  const renderCategoryEditDeleteButtons = (
    categoryName: string,
    innerIndex: number,
    outerIndex: number
  ) => (
    <>
      <Button
        size="tiny"
        status="info"
        style={{ marginRight: 5 }}
        onPress={() =>
          openDialog("Edit Category", outerIndex, innerIndex, categoryName)
        }
        disabled={requestBeingMade}
      >
        Edit
      </Button>
      <Button
        size="tiny"
        status="danger"
        disabled={requestBeingMade}
        onPress={() =>
          setTTCItems((oldItems) =>
            oldItems.filter((a) => a.categoryName !== categoryName)
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
        <Text category="h6">Current TTC</Text>
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
        <Text category="h6">Items</Text>
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
            {TTCItems.length === 0 ? (
              <Text style={{ textAlign: "center", margin: 20 }}>
                No items have been set yet!
              </Text>
            ) : (
              TTCItems.map((outerItem, outerKey) => (
                <View key={outerKey}>
                  <ListItem
                    title={(_) => (
                      <Text category="s1">{outerItem.categoryName}</Text>
                    )}
                    accessoryRight={() =>
                      renderCategoryEditDeleteButtons(
                        outerItem.categoryName,
                        -1,
                        outerKey
                      )
                    }
                    disabled
                  />
                  {outerItem.list.map((innerItem, innerKey) => (
                    <ListItem
                      key={innerKey}
                      style={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
                      title={innerItem}
                      accessoryRight={() =>
                        renderItemEditDeleteButtons(
                          innerItem,
                          innerKey,
                          outerKey
                        )
                      }
                      disabled
                    />
                  ))}
                  <ListItem
                    disabled
                    accessoryRight={() => (
                      <Button
                        size="small"
                        status="success"
                        style={{ marginVertical: 5 }}
                        onPress={() => openDialog("Add Item", outerKey, -1, "")}
                        disabled={requestBeingMade}
                      >
                        Add Item
                      </Button>
                    )}
                  />
                </View>
              ))
            )}
            <ListItem
              disabled
              accessoryRight={() => (
                <Button
                  size="small"
                  status="success"
                  style={{ marginVertical: 5 }}
                  onPress={() => openDialog("Add Category", -1, -1, "")}
                  disabled={requestBeingMade}
                >
                  Add Category
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
        <Dialog.Title titleStyle={{ margin: 10 }} title={editingMode} />
        <Input
          label="Item"
          value={editingValue}
          placeholder={editingMode === "Add Category" || editingMode === "Edit Category" ? "e.g Smartphones" : "e.g. Perform Key Word Search"}
          onChangeText={(text) => setEditingValue(text)}
          style={{ marginHorizontal: 10, marginVertical: 20 }}
        />
        <Dialog.Actions>
          <Button
            size="small"
            onPress={saveDialogChanges}
            status="success"
            style={{ marginHorizontal: 10 }}
          >
            {editingMode === "Add Category" || editingMode === "Add Item"
              ? editingMode
              : "Save"}
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
