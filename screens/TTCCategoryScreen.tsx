import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, ListItem, Spinner, Text } from "@ui-kitten/components";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/base";

type TTCCategoryScreen = {
  isLoading: boolean;
  categoryName: string;
  checkListItems: string[];
};

export default function TTCCategoryScreen(props: TTCCategoryScreen) {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getChecklistConfig = async () => {
      setIsLoading(true);
      setCheckedItems(props.checkListItems.map((_) => false));
      setIsLoading(false);
    };

    getChecklistConfig();
  }, [props.isLoading]);

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );

  return (
    <Layout style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text category="h6">{props.categoryName}</Text>
        <TouchableOpacity
          onPress={() =>
            setCheckedItems((oldItems) => oldItems.map((_) => false))
          }
        >
          <View
            style={{
              padding: 10,
              backgroundColor: "#0C2962",
              borderRadius: 10,
            }}
          >
            <MaterialCommunityIcon name="eraser" color="white" size={20} />
          </View>
        </TouchableOpacity>
      </View>
      {props.checkListItems.length === 0 ? (
        <Text style={{ textAlign: "center", margin: 20 }}>
          No items have been set yet! Please contact your head of lab to add
          items.
        </Text>
      ) : (
        <ScrollView style={{ marginTop: 20, marginLeft: 4 }}>
          {props.checkListItems.map((item, key) => (
            <ListItem
              key={key}
              title={item}
              accessoryRight={() => (
                <CheckBox
                  checked={checkedItems[key]}
                  onPress={() =>
                    setCheckedItems((oldCheckedItems) =>
                      oldCheckedItems.map((item, index) =>
                        index === key ? !oldCheckedItems[key] : item
                      )
                    )
                  }
                  // Use ThemeProvider to make change for all checkbox
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                  checkedColor="#419488"
                />
              )}
              disabled={true}
            />
          ))}
        </ScrollView>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
