import NoteScreen from "@/screens/NoteScreen";
import { NoteService } from "@/services/NoteService";
import { TextNote } from "@/types/Note";
import { Optional } from "@/types/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function TextNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<TextNote>();

  const [noteData, setNoteData] = useState<Optional<TextNote>>(params ?? {});
  const [saved, setSaved] = useState(Boolean(params));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        setSaved={setSaved}
        onSaveNote={async (genericData) => {
          const noteObject = {
            ...noteData,
            ...genericData,
          } as TextNote;

          const note = await NoteService.createTextNote(noteObject);
          return Boolean(note);
        }}
        saved={saved}
        {...noteData}
      >
        <TextInput
          placeholder="Escreva aqui :)"
          value={noteData.content}
          onChangeText={(value) => {
            setNoteData((prev) => ({ ...prev, content: value }));
            setSaved(false);
          }}
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
