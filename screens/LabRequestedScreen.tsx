import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@ui-kitten/components";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LabRequestedScreen() {
  return (
    <View style={styles.container}>
      <Text category="h5" style={{ paddingTop: 20 }}>
        Request Sent!
      </Text>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ padding: 20 }}>
          Your request to join lab LABNAME has been sent!
        </Text>
        <MaterialCommunityIcon
          name="email-fast-outline"
          color="black"
          size={100}
        />
        <Text style={{ padding: 20 }}>
          Please now wait until you are approved.
        </Text>
      </View>
      <Text style={{ padding: 20, textAlign: "center" }}>
        You can refresh this page by using the above refresh icon!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
