import ScreenContainer from "@/components/ScreenContainer";
import TextNote from "@/components/TextNote";
import { StyleSheet, Text, View } from "react-native";

export default function NotesScreen() {
  return (
    <ScreenContainer title="Notas">
      <View style={styles.notesContainer}>
        <TextNote
          title="Título"
          content="Lorem ipsum aljbfn osaijdbf sbdofbs odfosbid fbsoidb foisb doifbso dfisdfbisodifbos idbfobsodfb iosdbfosbdoif bsdiobfsiodbnf oisbdfoib sdofb os dbfosbdbfos dbiofbsdoib foisbdfoib soibdfiobsd ofbiaiorubeloçiquhb fçpoqaeiur hfblaoeuirbfglaoeiubrflçiou baçlroiufbg oiruebwçgfaoebiug çoaeibu rgfçoaihbuerfgioçbaeoirbtfgçaeorpihgt OÇ\LA´~IKRH TGFPÇOAEHRÇIOTH OIWeh "
        />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
        <TextNote title="Nhau" content="oi eu sou uma anotação top" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  notesContainer: {
    gap: 8,
  },
});
