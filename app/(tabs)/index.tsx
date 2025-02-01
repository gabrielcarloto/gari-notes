import AudioNote from "@/components/AudioNote";
import ScreenContainer from "@/components/ScreenContainer";
import Separator from "@/components/Separator";
import TextNote from "@/components/TextNote";
import ImageNote from "@/components/ImageNote";
import { View, SectionList, Alert, Modal, TextInput } from "react-native";
import { AddButton, AddButtonOption } from "@/components/AddButton";
import { useState } from "react";

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

        <AddButtonOption label="Pasta2" onPress={() => Alert.alert("oi")} />
      </AddButton>

      <Modal
        visible={showNewFolderDialog}
        onDismiss={() => {
          setShowNewFolderDialog(false);
          setNewFolder("");
        }}
      >
        <TextInput onChangeText={setNewFolder} />
      </Modal>
    </ScreenContainer>
  );
}

const EmptySeparator = ({ height = 8 }) => <View style={{ height }} />;
