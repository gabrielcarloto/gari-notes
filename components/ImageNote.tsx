import { Alert, StyleSheet, Text, View } from "react-native";
import NoteCard from "./NoteCard";
import { Image } from "expo-image";

interface Props {
  title: string;
  content: string;
}

export default function ImageNote({ title, content }: Props) {
  return (
    <NoteCard onPress={showAlert}>
      <Text style={styles.noteTitle}>{title}</Text>
      <Image source={content} style={styles.image}/>
    </NoteCard>
  );
}

const showAlert = () =>
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog.",
          ),
      },
    );

const styles = StyleSheet.create({
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#363636",
    marginBottom: 8,
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 8,
  },
});