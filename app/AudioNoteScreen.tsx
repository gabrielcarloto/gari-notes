import NoteScreen from "@/screens/NoteScreen";
import { AudioNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function TextNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<AudioNote>();
  const [saved, setSaved] = useState(Boolean(params));
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        saveNoteButtonText={saved ? "Ouvir" : "Gravar"}
        defaultTitle="Nota sem título"
        onShare={() => {}}
        onSaveNote={() => {}}
        {...params}
      >
      </NoteScreen>
    </>
  );
}
