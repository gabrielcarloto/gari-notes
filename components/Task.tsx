import { NoteService } from "@/services/NoteService";
import { TaskNote } from "@/types/Note";
import { Link } from "expo-router";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Task(props: TaskNote) {
  const [completed, setCompleted] = useState(props.completed);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setCompleted(!completed);
          NoteService.updateTaskNote({ ...props, completed: !completed }).then(
            (task) => {
              if (!task) setCompleted(completed);
            },
          );
        }}
        style={[
          styles.checkbox,
          completed ? styles.completedCheckbox : undefined,
        ]}
      />
      <Link
        href={{ pathname: "/TaskNoteScreen", params: { id: props.id } }}
        asChild
      >
        <TouchableOpacity
          onLongPress={() => {
            NoteService.deleteNote(props.id).then(() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            });
          }}
          style={styles.content}
        >
          <Text
            style={[styles.text, completed ? styles.completedText : undefined]}
          >
            {props.title}
          </Text>
          {props.reminder && (
            <Text
              style={[
                styles.text,
                styles.reminder,
                completed ? styles.completedText : undefined,
              ]}
            >
              {props.reminder.toDateString()}
            </Text>
          )}
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 16,
    height: 16,
    backgroundColor: "#FAFAFA",
    borderColor: "#6A6A6A",
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
  },

  completedCheckbox: {
    borderWidth: 0,
    backgroundColor: "#2FE998",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  text: {
    fontSize: 16,
    color: "#363636",
  },

  reminder: {
    fontSize: 12,
  },

  completedText: {
    color: "#808080",
  },
});
