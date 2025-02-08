import { StyleSheet, Text } from "react-native";
import NoteCard from "./NoteCard";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { ImageNote as ImageNoteProps } from "@/types/Note";

export default function ImageNote(props: ImageNoteProps) {
  return (
    <Link
      href={{
        pathname: "/ImageNoteScreen",
        params: {
          id: props.id,
        },
      }}
      asChild
      push
    >
      <NoteCard>
        <Text style={styles.noteTitle}>{props.title}</Text>
        <Image
          source={props.content}
          style={styles.image}
          cachePolicy={"memory-disk"}
        />
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
