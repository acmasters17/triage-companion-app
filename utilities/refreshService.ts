import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
// Function is going to be a monster at first
// basically it has to go get the pdf field from firebase
// then download the pdf
// then store the pdf in local storage
export async function refreshPDF() {
  // save sop to filesystem
  try {
    console.log("Downloading");
    const { uri } = await FileSystem.downloadAsync(
      "https://athenaforensics.co.uk/wp-content/uploads/2019/01/National-Police-Chiefs-Council-ACPO-Good-Practice-Guide-for-Digital-Evidence-March-2012.pdf",
      FileSystem.documentDirectory + "sop.pdf"
    );
    console.log("Downloaded to local fs");

    //save file uri to sop in async storage
    try {
      console.log("Setting async storage");
      await AsyncStorage.setItem("sop-uri", uri);
      console.log("Set local storage");
    } catch (e) {
      // saving error
    }
  } catch (e) {
    console.error(e);
  }
}
