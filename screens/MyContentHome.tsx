import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MyLabScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
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
        Manage Content
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("MyContentKit")}
        >
          <Text>Manage Kit Checklist</Text>
          <MaterialCommunityIcon name="chevron-right" size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("MyContentFlashCards")}
        >
          <Text>Manage Flash Cards</Text>
          <MaterialCommunityIcon name="chevron-right" size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("MyContentSOP")}
        >
          <Text>Manage SOP</Text>
          <MaterialCommunityIcon name="chevron-right" size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("MyContentTTC")}
        >
          <Text>Manage Technical Triage Checklist</Text>
          <MaterialCommunityIcon name="chevron-right" size={18} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menuButton: {
    width: "100%",
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    display: "flex",
    flexDirection: "row",
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
