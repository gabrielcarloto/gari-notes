import { StyleSheet, Text } from "react-native";
import NoteCard from "./NoteCard";
import { Image } from "expo-image";
import { Link } from "expo-router";

interface Props {
  title: string;
  content: string;
}

export default function ImageNote({ title, content }: Props) {
  return (
    <Link
      href={{ pathname: "/ImageNoteScreen", params: { title, content } }}
      asChild
      push
    >
      <NoteCard>
        <Text style={styles.noteTitle}>{title}</Text>
        <Image source={content} style={styles.image}/>
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
  image: {
    height: 200,
    width: "100%",
    borderRadius: 8,
  },
});