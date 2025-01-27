import ScreenContainer from "@/components/ScreenContainer";
import Separator from "@/components/Separator";
import TextNote from "@/components/TextNote";
import { StyleSheet, FlatList, View, SectionList } from "react-native";

function makeNote(title: string, content: string) {
  return {
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
          return <TextNote {...item} />;
        }}
      />
    </ScreenContainer>
  );
}

const EmptySeparator = () => <View style={{ height: 8 }} />;
