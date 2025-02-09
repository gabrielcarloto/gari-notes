import { StyleSheet, Text, View } from "react-native";
import NoteCard from "./NoteCard";
import { Link } from "expo-router";
import type { AudioNote as AudioNoteProps } from "@/types/Note";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

export default function AudioNote(props: AudioNoteProps) {
  const player = new AudioRecorderPlayer();

  return (
    <Link
      href={{ pathname: "/AudioNoteScreen", params: { id: props.id } }}
      asChild
      push
    >
      <NoteCard>
        <View style={styles.container}>
          <Text style={styles.noteTitle}>{props.title}</Text>
          <Text style={styles.content}>{player.mmssss(props.duration)}</Text>
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
