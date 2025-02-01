import Button from "@/components/Button";
import ScreenContainer from "@/components/ScreenContainer";
import { Note } from "@/types/Note";
import { useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Separator from "@/components/Separator";
import { useNavigation } from "expo-router";

type GenericNoteData = Pick<Note, "isInTrash" | "folder"> & { title?: string };

interface Props extends GenericNoteData {
  children: React.ReactNode;
  onShare: (data: GenericNoteData) => void;
  onSaveNote: (data: GenericNoteData) => boolean;
  defaultTitle: string;
  saved: boolean;
}

export default function NoteScreen({
  title,
  folder,
  isInTrash,
  saved,
  onShare,
  onSaveNote,
  defaultTitle,
  children,
}: Props) {
  const [isNoteSaved, setIsNoteSaved] = useState(saved);

  const [noteData, setNoteData] = useState<GenericNoteData>({
    title: title,
    folder: folder,
    isInTrash: isInTrash,
  });

  const { goBack } = useNavigation();

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isNoteSaved) {
        Alert.alert("Espere!!", "Se você sair agora, perderá o conteúdo.", [
          {
            text: "Sair",
            onPress: goBack,
          },
          {
            text: "Cancelar",
          },
        ]);
      }

      return true;
    });

    return () => handler.remove();
  });

  return (
    <ScreenContainer containerStyle={{ paddingBottom: 32 }}>
      <TextInput
        placeholder={defaultTitle}
        value={noteData.title}
        onChangeText={(value) => {
          setNoteData((prev) => ({ ...prev, title: value }));
          setIsNoteSaved(false);
        }}
        style={[styles.titleInput, !title?.length && { color: "#888" }]}
      />

      <View style={styles.titleSeparator} />

      <Picker onValueChange={(value) => console.log(value)} selectedValue="">
        <Picker.Item label="Selecione a pasta" value="" />
        <Picker.Item label="pasta1" value="pasta1" />
        <Picker.Item label="pasta2" value="pasta2" />
      </Picker>

      <Separator style={{ height: 1 }} />

      <View style={styles.content}>{children}</View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              setNoteData((prev) => ({ ...prev, isInTrash: !prev.isInTrash }));
            }}
          >
            {noteData.isInTrash ? "Restaurar" : "Excluir"}
          </Button>
          <Button onPress={() => onShare(noteData)} style={{ flex: 1 }}>
            Compartilhar
          </Button>
        </View>

        <Button
          onPress={() => {
            if (onSaveNote(noteData)) {
              setIsNoteSaved(true);
            }
          }}
        >
          Salvar
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  titleInput: {
    fontSize: 28,
    fontWeight: 500,
    width: "100%",
    color: "#363636",
  },

  titleSeparator: {
    height: 1,
    width: "100%",
    backgroundColor: "#4A4A4A",
  },

  content: {
    flex: 1,
    padding: 8,
  },
});
