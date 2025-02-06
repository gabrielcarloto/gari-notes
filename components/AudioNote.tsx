import { StyleSheet, Text, View } from "react-native";
import NoteCard from "./NoteCard";
import { Link } from "expo-router";

interface Props {
  title: string;
  content: string;
}

export default function AudioNote({ title, content }: Props) {
  return (
    <Link
      href={{ pathname: "/AudioNoteScreen", params: { title, content } }}
      asChild
      push
    >
      <NoteCard>
        <View style={styles.container}>
          <Text style={styles.noteTitle}>{title}</Text>
          <Text style={styles.content}>
            {content}
          </Text>
        </View>
      </NoteCard>
    </Link>
  );
}

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