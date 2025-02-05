import NoteScreen from "@/screens/NoteScreen";
import { TextNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function TextNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<TextNote>();
  const [noteContent, setNoteContent] = useState(params.content);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        onSaveNote={() => {}}
        {...params}
      >
        <TextInput
          placeholder="Escreva aqui :)"
          value={noteContent}
          onChangeText={setNoteContent}
          style={styles.input}
          multiline
          autoFocus
          textAlignVertical="top"
        />
      </NoteScreen>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});
