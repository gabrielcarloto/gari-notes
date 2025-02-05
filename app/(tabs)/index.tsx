import AudioNote from "@/components/AudioNote";
import ScreenContainer from "@/components/ScreenContainer";
import Separator from "@/components/Separator";
import TextNote from "@/components/TextNote";
import ImageNote from "@/components/ImageNote";
import {
  View,
  SectionList,
  Alert,
  Modal,
  TextInput,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AddButton, AddButtonOption } from "@/components/AddButton";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { NoteService } from "@/services/NoteService";
import { router } from "expo-router";

function makeNote(title: string, content: string) {
  return {
    type: "text" as const,
    title,
    content,
  };
}

function makeAudio(title: string, content: string) {
  return {
    type: "audio" as const,
    title,
    content,
  };
}

function makeImage(title: string, content: string) {
  return {
    type: "image" as const,
    title,
    content,
  };
}

const DATA = [
  {
    folder: undefined,
    notes: [
      makeNote(
        "Título",
        "Lorem ipsum aljbfn osaijdbf sbdofbs odfosbid fbsoidb foisb doifbso dfisdfbisodifbos idbfobsodfb iosdbfosbdoif bsdiobfsiodbnf oisbdfoib sdofb os dbfosbdbfos dbiofbsdoib foisbdfoib soibdfiobsd ofbiaiorubeloçiquhb fçpoqaeiur hfblaoeuirbfglaoeiubrflçiou baçlroiufbg oiruebwçgfaoebiug çoaeibu rgfçoaihbuerfgioçbaeoirbtfgçaeorpihgt OÇLA´~IKRH TGFPÇOAEHRÇIOTH OIWeh ",
      ),
      makeAudio("Audio", "2:43"),
      makeImage("Imagem", "https://picsum.photos/200/300"),
    ],
  },
  {
    folder: "Pasta 1",
    notes: Array.from({ length: 6 }, () =>
      makeNote("Nhau", "oi eu sou uma anotação top"),
    ),
  },
  {
    folder: "Pasta 2",
    notes: Array.from({ length: 6 }, () =>
      makeNote("Nhau", "oi eu sou uma anotação top da pasta 2"),
    ),
  },
] as const;

const sections = DATA.map(({ folder, notes }) => ({
  title: folder,
  data: notes,
}));

const COMPONENT_TYPES = {
  text: TextNote,
  audio: AudioNote,
  image: ImageNote,
};

const ADD_BUTTON_SIZE = 48 + 16;

export default function NotesScreen() {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  return (
    <ScreenContainer
      title="Notas"
      containerStyle={{ padding: 0, paddingTop: 32 }}
    >
      <SectionList
        sections={sections}
        contentContainerStyle={{ paddingLeft: 32, paddingRight: 32 }}
        renderSectionHeader={({ section }) => {
          return section.title ? <Separator label={section.title} /> : null;
        }}
        SectionSeparatorComponent={EmptySeparator}
        ItemSeparatorComponent={EmptySeparator}
        ListFooterComponent={() => <EmptySeparator height={ADD_BUTTON_SIZE} />}
        renderItem={({ item }) => {
          const Component = COMPONENT_TYPES[item.type];
          return <Component {...item} />;
        }}
      />
      <AddButton>
        <AddButtonOption
          label="Pasta"
          onPress={() => setShowNewFolderDialog(true)}
        />

        <AddButtonOption
          label="Áudio"
          onPress={() => router.push("/AudioNoteScreen")}
        />

        <AddButtonOption
          label="Foto"
          onPress={() => router.push("/ImageNoteScreen")}
        />

        <AddButtonOption
          label="Nota"
          onPress={() => router.push("/TextNoteScreen")}
        />
      </AddButton>

      <Modal
        transparent
        animationType="fade"
        visible={showNewFolderDialog}
        onRequestClose={() => {
          setShowNewFolderDialog(false);
          setNewFolder("");
        }}
      >
        <View style={styles.modal}>
          <View style={styles.dialog}>
            <Input
              onChange={setNewFolder}
              value={newFolder}
              label="Insira o nome da nova pasta"
            />
            <View style={{ flexDirection: "row", width: "100%", gap: 8 }}>
              <Button
                style={{ flex: 1 }}
                secondary
                onPress={() => setShowNewFolderDialog(false)}
              >
                Fechar
              </Button>
              <Button
                style={{ flex: 1 }}
                onPress={() =>
                  NoteService.createFolder(newFolder).then((folder) => {
                    if (!folder) {
                      return Alert.alert("Ocorreu um erro!");
                    }

                    setNewFolder("");
                    setShowNewFolderDialog(false);
                  })
                }
              >
                Salvar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const EmptySeparator = ({ height = 8 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#363636AA",
  },

  dialog: {
    backgroundColor: "white",
    padding: 8,
    gap: 8,

    width: Dimensions.get("window").width * 0.95,
  },

  input: {
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
  },
});
