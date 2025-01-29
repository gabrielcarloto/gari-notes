import AudioNote from "@/components/AudioNote";
import ScreenContainer from "@/components/ScreenContainer";
import Separator from "@/components/Separator";
import TextNote from "@/components/TextNote";
import ImageNote from "@/components/ImageNote";
import { StyleSheet, FlatList, View, SectionList } from "react-native";

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
}

export default function NotesScreen() {
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
        renderItem={({ item }) => {
          const Component = COMPONENT_TYPES[item.type];
          return <Component {...item} />;
        }}
      />
    </ScreenContainer>
  );
}

const EmptySeparator = () => <View style={{ height: 8 }} />;
