import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Layout, ListItem, Spinner, Text } from "@ui-kitten/components";
import { getFunctions, httpsCallable } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sanitizeLabName } from "../utilities/sanitizer";
import { throwToastError } from "../utilities/toastFunctions";
import { Avatar } from "@rneui/base";
import { auth } from "../utilities/firebaseConfig";

type User = {
  id: string;
  email: string;
  approved: boolean;
};

export default function MyLabScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [requestBeingMade, setRequestBeingMade] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState<User[]>([]);
  const [labName, setLabName] = useState("");
  const functions = getFunctions();

  // get all users on start up
  useEffect(() => {
    const getUserList = async () => {
      setIsLoading(true);
      // Cloud Request to join lab so call an async request
      const requestAllUsersList = httpsCallable(functions, "getLabUsers");
      const loadedLabName = await AsyncStorage.getItem("lab-name");
      if (loadedLabName) {
        setLabName(loadedLabName);
        try {
          // cloud request to get all users
          const req = await requestAllUsersList({
            labName: sanitizeLabName(loadedLabName),
          });

          // get users
          const data = req.data as any;
          const newUsers = data.users as User[];

          setApprovedUsers(newUsers.filter((user) => user.approved));
          setUnapprovedUsers(newUsers.filter((user) => !user.approved));

        } catch (e) {
          throwToastError(e);
        }
      }
      setIsLoading(false);
    };

    getUserList();
  }, []);

  const approveUser = async (user: User) => {
    setRequestBeingMade(true);
    // calls the approve user function and then moves the user from one page to the other
    const approveUserInLab = httpsCallable(functions, "approveUserInLab");

    try {
      await approveUserInLab({
        labName: sanitizeLabName(labName),
        id: user.id,
      });

      setUnapprovedUsers((oldUsers) =>
        oldUsers.filter((target) => target.id !== user.id)
      );

      setApprovedUsers((oldUsers) => [...oldUsers, user]);

      // set finished if made it here without an error
      setRequestBeingMade(false);
    } catch (e) {
      throwToastError(e);
    }
  };

  const deleteUserFromApproved = async (user: User) => {
    setRequestBeingMade(true);
    // calls the delete user function to remove from backend
    const deleteUserFromLab = httpsCallable(functions, "removeUserFromLab");

    try {
      await deleteUserFromLab({
        labName: sanitizeLabName(labName),
        id: user.id,
      });

      // if returns good then lets remove that user from the approved list
      setApprovedUsers((oldUsers) =>
        oldUsers.filter((target) => target.id !== user.id)
      );

      // set finished if made it here without an error
      setRequestBeingMade(false);
    } catch (e) {
      throwToastError(e);
    }
  };

  const deleteUserFromUnapproved = async (user: User) => {
    setRequestBeingMade(true);
    // calls the delete user function to remove from backend
    const deleteUserFromLab = httpsCallable(functions, "removeUserFromLab");

    try {
      await deleteUserFromLab({
        labName: sanitizeLabName(labName),
        id: user.id,
      });

      // if returns good then lets remove that user from the approved list
      setUnapprovedUsers((oldUsers) =>
        oldUsers.filter((target) => target.id !== user.id)
      );

      // set finished if made it here without an error
      setRequestBeingMade(false);
    } catch (e) {
      throwToastError(e);
    }
  };

  const renderDeleteButton = (user: User) => (
    <Button
      size="tiny"
      status="danger"
      disabled={requestBeingMade}
      onPress={() => deleteUserFromApproved(user)}
    >
      Delete
    </Button>
  );

  const renderApproveDenyButton = (user: User) => (
    <>
      <Button
        size="tiny"
        status="success"
        style={{ marginRight: 5 }}
        disabled={requestBeingMade}
        onPress={() => approveUser(user)}
      >
        Approve
      </Button>
      <Button
        size="tiny"
        status="danger"
        disabled={requestBeingMade}
        onPress={() => deleteUserFromUnapproved(user)}
      >
        Delete
      </Button>
    </>
  );

  const renderAvatar = (user: User) => (
    <Avatar
      rounded
      title={user.email[0].toUpperCase()}
      containerStyle={{ backgroundColor: "#0C2962" }}
    />
  );

  return (
    <Layout style={styles.container}>
      <ScrollView style={{ margin: 20 }}>
        <Text category="h6">My Lab</Text>

        <Text category="s2" style={{ marginVertical: 10 }}>
          Active Users
        </Text>
        {isLoading ? (
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Spinner />
          </View>
        ) : (
          approvedUsers.map((user, key) => (
            <ListItem
              key={key}
              style={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
              title={user.email}
              description={
                user.id === auth.currentUser?.uid ? "Lab Owner" : "Lab Member"
              }
              accessoryLeft={() => renderAvatar(user)}
              accessoryRight={() => user.id !== auth.currentUser?.uid ? renderDeleteButton(user) : <></>}
            />
          ))
        )}
        <Text category="s2" style={{ marginVertical: 10 }}>
          Users waiting approval
        </Text>
        {isLoading ? (
          <View
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Spinner />
          </View>
        ) : (
          unapprovedUsers.map((user, key) => (
            <ListItem
              key={key}
              style={{ backgroundColor: "#EEEEEE", marginVertical: 2 }}
              title={user.email}
              description={
                user.id === auth.currentUser?.uid ? "Lab Owner" : "Lab Member"
              }
              accessoryLeft={() => renderAvatar(user)}
              accessoryRight={() => renderApproveDenyButton(user)}
            />
          ))
        )}
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
