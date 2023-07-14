import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Layout, Text } from "@ui-kitten/components";
import { auth } from "../utilities/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";
import { Avatar } from "@rneui/base";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function ProfileScreen() {
  const [isLabOwner, setIsLabOwner] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // check if lab owner
    const checkIfLabOwner = async () => {
      // get values from local storage about if this user created it or not and if it matches currently assigned one
      try {
        const labOwner = await AsyncStorage.getItem("lab-owner");
        if (labOwner !== null) {
          // labowner so set to true
          setIsLabOwner(true);
        }
      } catch (e) {
        throwToastError(e);
      }
    };

    checkIfLabOwner();
  });

  return auth.currentUser ? (
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
        Profile
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-start",
          marginVertical: 10,
        }}
      >
        <Avatar
          size="large"
          rounded
          title={auth.currentUser.email ? auth.currentUser.email[0].toUpperCase() : "Er"}
          containerStyle={{ backgroundColor: "#0C2962", marginLeft: 20 }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <Text category="s1">{`${auth.currentUser.email}`}</Text>
          <Text category="s2">{isLabOwner ? "Lab Owner" : "Lab Member"}</Text>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 20,
        }}
      >
        {isLabOwner ? (
          <>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate("MyLab")}
            >
              <Text>My Lab</Text>
              <MaterialCommunityIcon name="chevron-right" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate("MyContentHome")}
            >
              <Text>Manage Lab Content</Text>
              <MaterialCommunityIcon name="chevron-right" size={18} />
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}
        <Button
          style={{
            width: "100%",
            marginTop: 20,
            marginBottom: 4,
            paddingVertical: 15,
          }}
          status="warning"
          onPress={async () => {
            try {
              await AsyncStorage.setItem("lab-name", "");
              await AsyncStorage.setItem("lab-approved", "false");
              auth.signOut();
            } catch (e) {
              // saving error
              throwToastError(e);
            }
          }}
        >
          Complete Cache Clear Sign Out
        </Button>
        <Button
          style={{ marginVertical: 8, width: "100%", paddingVertical: 15 }}
          status="danger"
          onPress={() => auth.signOut()}
        >
          Sign Out
        </Button>
      </View>
    </Layout>
  ) : (
    <Text>Sorry something went wrong! Please try again later.</Text>
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
