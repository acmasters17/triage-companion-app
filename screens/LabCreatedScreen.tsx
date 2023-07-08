import React from "react";
import { Button, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type LabCreatedScreenProps = {
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LabCreatedScreen(props: LabCreatedScreenProps) {
  return (
    <View style={styles.container}>
      <Text category="h5" style={{ paddingTop: 20 }}>
        Lab Created!
      </Text>
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ padding: 20 }}>
          Congratulation you have just created LABNAME!
        </Text>
        <MaterialCommunityIcon
          name="check-circle-outline"
          color="#41AD49"
          size={200}
        />
        <Text style={{ padding: 20, textAlign: "center" }}>
          Please now click next to progress and begin setting up your lab and
          adding users
        </Text>
      </View>
      <Button
        style={{ width: "60%", marginBottom: 100 }}
        onPress={() => {
          props.setSignedIn(true);
        }}
      >
        Start
      </Button>
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
