import NoteScreen from "@/screens/NoteScreen";
import { TextNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import { TextInput, View } from "react-native";

export default function TextNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<TextNote>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        onSaveNote={() => {}}
        {...params}
      >
        <TextInput placeholder="Escreva aqui :)" />
      </NoteScreen>
    </>
  );
}
