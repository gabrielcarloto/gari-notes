import NoteScreen from "@/screens/NoteScreen";
import { ImageNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import { TextInput, View } from "react-native";
import { Image } from "expo-image";

export default function ImageNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<ImageNote>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        onSaveNote={() => {}}
        {...params}
      >
        <Image source={params.content} style={{ height: 200, width: "100%", borderRadius: 8}} />
        <TextInput placeholder="Descrição" />
      </NoteScreen>
    </>
  );
}
