import { Alert, StyleSheet, Text } from "react-native";
import NoteCard from "./NoteCard";

interface Props {
  title: string;
  content: string;
}

export default function TextNote({ title, content }: Props) {
  return (
    <NoteCard onPress={showAlert} title={title}>
      <Text numberOfLines={2} style={styles.content}>
        {content}
      </Text>
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
  content: {
    color: "#444",
    fontSize: 12,
  },
});
