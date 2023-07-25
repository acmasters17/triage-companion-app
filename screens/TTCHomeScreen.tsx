import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Button, Layout, Spinner, Text } from "@ui-kitten/components";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type TTCScreenProps = {
  isLoading: boolean,
  categories: Category[]
};

type Category = {
  categoryName: string;
  list: string[];
};



export default function TTCHomeScreen(props: TTCScreenProps) {

  if (props.isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );

  return (
    <Layout style={styles.container}>
      <Text
        category="h6"
        style={{
          marginTop: 20,
          alignSelf: "center",
        }}
      >
        Technical Triage Checklist
      </Text>
      <Text
        category="s1"
        style={{
          marginVertical: 10,
          marginHorizontal: 20,
          textAlign: "center",
        }}
      >
        A checklist of technical triage recommendations based off device type
      </Text>
      {props.categories.length === 0 ? (
        <Text style={{ textAlign: "center", margin: 20 }}>
          No categories have been set yet! Please contact your head of lab to add
          items.
        </Text>
      ) : (
        <ScrollView style={{ marginTop: 20, marginLeft: 4 }}>
          {props.categories.map((item, key) => <Button key={key}>{item.categoryName}</Button>)}
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
