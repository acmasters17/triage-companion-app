import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import { Avatar, ListItem } from "@rneui/base";
import { auth } from "../utilities/firebaseConfig";

type User = {
  id: string;
  email: string;
  approved: boolean;
};

export default function MyLabScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // get all users on start up
  useEffect(() => {
    const getUserList = async () => {
      setIsLoading(true);
      // Cloud Request to join lab so call an async request
      const functions = getFunctions();
      const requestAllUsersList = httpsCallable(functions, "getLabUsers");
      const labName = await AsyncStorage.getItem("lab-name");
      if (labName) {
        try {
          // cloud request to get all users
          const req = await requestAllUsersList({
            labName: sanitizeLabName(labName),
          });

          // get users
          const data = req.data as any;
          const newUsers = data.users as User[];

          setUsers(newUsers);

          console.log(req.data);
        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getUserList();
  }, []);

  return (
    <Layout style={styles.container}>
      <ScrollView style={{ margin: 20 }}>
        <Text category="h6">My Lab</Text>

        <Text category="s2" style={{ marginVertical: 10 }}>
          Active Users
        </Text>
        {users.map((user, key) => (
          <ListItem
            key={key}
            containerStyle={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
          >
            <Avatar
              rounded
              title={user.email[0]}
              containerStyle={{ backgroundColor: "#0C2962" }}
            />
            <ListItem.Content>
              <ListItem.Title>{user.email}</ListItem.Title>
              <ListItem.Subtitle>
                {user.id === auth.currentUser?.uid ? "Lab Owner" : "Lab Member"}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
        <Text category="s2" style={{ marginVertical: 10 }}>
          Users waiting approval
        </Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
