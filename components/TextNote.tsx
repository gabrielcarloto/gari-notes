import { StyleSheet, Text } from "react-native";
import NoteCard from "./NoteCard";
import { Link } from "expo-router";
import { TextNote as TextNoteProps } from "@/types/Note";
import { NoteService } from "@/services/NoteService";

export default function TextNote(props: TextNoteProps) {
  return (
    <Link href={{ pathname: "/TextNoteScreen", params: props }} asChild push>
      <NoteCard onLongPress={() => NoteService.deleteNote(props.id)}>
        <Text style={styles.noteTitle}>{props.title}</Text>
        <Text numberOfLines={2} style={styles.content}>
          {props.content}
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
