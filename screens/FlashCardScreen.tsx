import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { throwToastError } from "../utilities/toastFunctions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { CheckBox } from "@rneui/base";
import Carousel from "../components/Carosel";


type FlashCardScreenProps = {
  reloadBecauseOfCloud: boolean;
};

export default function FlashCardScreen(props: FlashCardScreenProps) {
  const [flashCards, setFlashCards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const width = Dimensions.get("window").width;

  // get loaded flashcards
  useEffect(() => {
    const getFlashcardsConfig = async () => {
      setIsLoading(true);
      const loadedFlashCards = await AsyncStorage.getItem("flashCards");
      if (loadedFlashCards) {
        try {
          //parsing it
          const newFlashCards = JSON.parse(loadedFlashCards) as string[];

          setFlashCards(newFlashCards);
        } catch (e) {
          throwToastError("No Flashcards have been set yet");
        }
      }
      setIsLoading(false);
    };

    getFlashcardsConfig();
  }, [props.reloadBecauseOfCloud]);

  if (isLoading)
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
        }}
      >
        Triage Flashcards
      </Text>
      <Text
        category="s1"
        style={{
          marginVertical: 10,
          marginHorizontal: 20,
          textAlign: "center"
        }}
      >
        A quick set of cards to aid decision making when a device is found in
        tough situations
      </Text>
      {flashCards.length === 0 ? (
        <Text style={{ textAlign: "center", margin: 20 }}>
          No flashcards have been set yet! Please contact your head of lab to
          add some.
        </Text>
      ) : (
        <Carousel flashCards={flashCards}/>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
