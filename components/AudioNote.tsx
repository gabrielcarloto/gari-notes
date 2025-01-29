import { Alert, StyleSheet, Text, View } from "react-native";
import NoteCard from "./NoteCard";

interface Props {
  title: string;
  content: string;
}

export default function AudioNote({ title, content }: Props) {
  return (
    <NoteCard onPress={showAlert}>
      <View style={styles.container}>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text style={styles.content}>
          {content}
        </Text>
      </View>
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
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    color: "#444",
    fontSize: 12,
  },
});