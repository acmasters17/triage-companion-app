import React, { useCallback, memo, useRef, useState } from "react";
import { FlatList, View, Dimensions, StyleSheet } from "react-native";
import { Card, Text } from "@ui-kitten/components";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

type CarouselProps = {
  flashCards: string[];
};

export default function Carousel(props: CarouselProps) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;

  const onScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  return (
    <>
      <FlatList
        data={props.flashCards}
        renderItem={({ item, index }) => (
          <View style={styles.slide} key={index}>
            <View
              style={{
                width: "85%",
                height: "70%",
                justifyContent: "center",
                backgroundColor: "#F4F4F4",
                shadowColor: "#171717",
                shadowOffset: { width: -2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text style={{ textAlign: "center", margin: 10 }} category="s1">{item}</Text>
            </View>
          </View>
        )}
        style={{ maxHeight: "50%", }}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
      />
      <View style={styles.pagination}>
        {props.flashCards.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  slide: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
  },

  pagination: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotInactive: { backgroundColor: "lightblue" },
  paginationDotActive: { backgroundColor: "gray" },
});
