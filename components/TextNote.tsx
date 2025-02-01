import { StyleSheet, Text } from "react-native";
import NoteCard from "./NoteCard";
import { Link } from "expo-router";

interface Props {
  title: string;
  content: string;
}

export default function TextNote({ title, content }: Props) {
  return (
    <Link
      href={{ pathname: "/TextNoteScreen", params: { title } }}
      asChild
      push
    >
      <NoteCard>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text numberOfLines={2} style={styles.content}>
          {content}
        </Text>
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
  content: {
    color: "#444",
    fontSize: 12,
  },
});
