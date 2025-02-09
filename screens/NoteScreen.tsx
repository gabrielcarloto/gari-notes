import Button from "@/components/Button";
import ScreenContainer from "@/components/ScreenContainer";
import { Folder, GenericNote, Note } from "@/types/Note";
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
import blobToDataURL from "@/utils/file";

import Share from "react-native-share";

type GenericNoteData = Pick<Note, "isInTrash" | "folder"> & { title?: string };

interface Props extends Optional<GenericNoteData> {
  children: React.ReactNode;
  saveNoteButtonText?: string;
  onShare: (data: Partial<GenericNoteData>) => {
    message: string;
    fileURL?: string;
    fileType?: string;
  };
  onSaveNote: (data: Partial<GenericNoteData>) => Promise<boolean>;
  defaultTitle: string;
  saved: boolean;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
  noteData: Partial<GenericNote>;
  setNoteData: React.Dispatch<React.SetStateAction<GenericNote>>;
  folderType?: "folder" | "project";
}

export default function NoteScreen({
  saved: isNoteSaved,
  setSaved: setIsNoteSaved,
  onShare,
  onSaveNote,
  defaultTitle,
  children,
  saveNoteButtonText,
  noteData,
  setNoteData,
  folderType = "folder",
}: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);

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

  function handleSaveNote(data: typeof noteData) {
    ToastAndroid.show("Salvando...", ToastAndroid.SHORT);
    onSaveNote(data)
      .then((saved) => {
        setIsNoteSaved(saved);
        if (saved) {
          ToastAndroid.show("Salvo com sucesso", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Ocorreu um erro", ToastAndroid.SHORT);
        }
      })
      .catch(() => {
        ToastAndroid.show("Ocorreu um erro", ToastAndroid.SHORT);
      });
  }

  async function handleShare(opts: {
    message: string;
    fileURL?: string;
    fileType?: string;
  }) {
    if (opts.fileURL) {
      const data = await fetch(opts.fileURL);
      const blob = await data.blob();
      const dataURL = await blobToDataURL(blob);

      const dataURLStart = "data:" + opts.fileType + ";base64,";

      return await Share.open({
        message: opts.message,
        url: opts.fileURL ? dataURLStart + dataURL.split(",")[1] : undefined,
        type: opts.fileType,
        filename: opts.fileType
          ? "file." + opts.fileType.split("/")[1]
          : undefined,
      });
    }

    await Share.open({
      message: opts.message,
    });
  }

  return (
    <ScreenContainer containerStyle={{ paddingBottom: 32 }}>
      <TextInput
        placeholder={defaultTitle}
        value={noteData.title}
        onChangeText={(value) => {
          setNoteData((prev) => ({ ...prev, title: value }));
          setIsNoteSaved(false);
        }}
        style={[
          styles.titleInput,
          !noteData.title?.length && { color: "#888" },
        ]}
      />

      <View style={styles.titleSeparator} />

      <Picker
        selectedValue=""
        onValueChange={(value) => {
          setNoteData((prev) => ({ ...prev, folder: value }));
          setIsNoteSaved(false);
        }}
      >
        <Picker.Item
          label={
            "Selecione " + (folderType === "folder" ? "a pasta" : "o projeto")
          }
          value=""
        />
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
                handleSaveNote(newData);
                return newData;
              });
            }}
          >
            {noteData.isInTrash ? "Restaurar" : "Excluir"}
          </Button>
          <Button
            onPress={() => handleShare(onShare(noteData))}
            style={{ flex: 1 }}
          >
            Compartilhar
          </Button>
        </View>

        <Button onPress={() => handleSaveNote(noteData)}>
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
