import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import { Button, Layout, Spinner, Text } from "@ui-kitten/components";
import { Category } from "../utilities/categoriesModel";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const laptopBackground = require("../assets/laptop-card-background.png");
const smartphoneBackground = require("../assets/smartphone-card-background.png");
const tabletBackground = require("../assets/tablet-card-background.png");
const otherBackground = require("../assets/other-card-background.png");

type TTCScreenProps = {
  isLoading: boolean;
  categories: Category[];
  setChosenCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function TTCHomeScreen(props: TTCScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const getBackground = (categoryName: string) => {
    const cleanedCategoryName = categoryName.replace(/\s+/g, "").toLowerCase();
    switch (cleanedCategoryName) {
      case "laptop":
        return laptopBackground;
      case "smartphone":
        return smartphoneBackground;
      case "tablet":
        return tabletBackground;
      default:
        return otherBackground;
    }
  };

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
          No categories have been set yet! Please contact your head of lab to
          add items.
        </Text>
      ) : (
        <ScrollView style={{ marginTop: 20, marginHorizontal: 20 }}>
          {props.categories.map((item, key) => (
            <TouchableOpacity
              key={key}
              onPress={() => {
                props.setChosenCategoryIndex(key);
                navigation.navigate("TTCCategory");
              }}
              style={{ marginVertical: 10 }}
            >
              <ImageBackground
                source={getBackground(item.categoryName)}
                style={{ width: "100%", height: 150, borderRadius: 20 }}
                resizeMode="cover"
                imageStyle={{ borderRadius: 20 }}
                blurRadius={3}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    shadowColor: "#171717",
                    shadowOffset: { width: -2, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                >
                  <Text style={{ padding: 8 }} category="s1">
                    {item.categoryName}
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
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
