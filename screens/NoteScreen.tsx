import Button from "@/components/Button";
import ScreenContainer from "@/components/ScreenContainer";
import { Folder, Note } from "@/types/Note";
import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Separator from "@/components/Separator";
import { useNavigation } from "expo-router";
import { NoteService } from "@/services/NoteService";
import { Optional } from "@/types/utils";

type GenericNoteData = Pick<Note, "isInTrash" | "folder"> & { title?: string };

interface Props extends Optional<GenericNoteData> {
  children: React.ReactNode;
  saveNoteButtonText?: string;
  onShare: (data: GenericNoteData) => void;
  onSaveNote: (data: GenericNoteData) => Promise<boolean>;
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
  saveNoteButtonText,
}: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isNoteSaved, setIsNoteSaved] = useState(saved);

  const [noteData, setNoteData] = useState<GenericNoteData>({
    title: title,
    folder: folder ?? "",
    isInTrash: isInTrash ?? false,
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
            text: "Voltar à nota",
          },
          {
            text: "Salvar",
            onPress: () => onSaveNote(noteData),
          },
        ]);
      } else {
        goBack();
      }

      return true;
    });

    return () => handler.remove();
  });

  useEffect(() => {
    NoteService.allFolders().then(setFolders);
  }, []);

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

      <Picker
        selectedValue=""
        onValueChange={(value) => {
          setNoteData((prev) => ({ ...prev, folder: value }));
          setIsNoteSaved(false);
        }}
      >
        <Picker.Item label="Selecione a pasta" value="" />
        {folders.map((folder) => (
          <Picker.Item
            key={folder.id}
            label={folder.name}
            value={folder.name}
          />
        ))}
      </Picker>

      <Separator style={{ height: 1 }} />

      <View style={styles.content}>{children}</View>

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button
            style={{ flex: 1 }}
            onPress={() => {
              setNoteData((prev) => {
                const newData = { ...prev, isInTrash: !prev.isInTrash };
                onSaveNote(newData);
                return newData;
              });
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
            ToastAndroid.show("Salvando...", ToastAndroid.SHORT);
            onSaveNote(noteData).then((saved) => {
              setIsNoteSaved(saved);
              if (saved) {
                ToastAndroid.show("Salvo com sucesso", ToastAndroid.SHORT);
              } else {
                ToastAndroid.show("Ocorreu um erro", ToastAndroid.SHORT);
              }
            });
          }}
        >
          {saveNoteButtonText ?? "Salvar"}
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
