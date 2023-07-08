import React from "react";
import Toast from "react-native-toast-message";

export function throwToastError(e: unknown) {
  Toast.show({
    type: "error",
    text1: "Sorry something went wrong",
    text2: `${e}`,
    position: "bottom",
  });
}
