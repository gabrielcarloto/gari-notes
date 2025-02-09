import Separator from "@/components/Separator";
import { View, SectionList, StyleProp, ViewStyle } from "react-native";
import { useMemo } from "react";
import { GenericNote, Note } from "@/types/Note";
import AudioNote from "@/components/AudioNote";
import ImageNote from "@/components/ImageNote";
import TextNote from "@/components/TextNote";
import Task from "./Task";

const COMPONENT_TYPES = {
  text: TextNote,
  audio: AudioNote,
  image: ImageNote,
  task: Task,
};

interface Props {
  notes: GenericNote[];
  footerComponent?: React.ReactElement;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function NoteList({
  notes,
  footerComponent,
  containerStyle,
}: Props) {
  const sections = useMemo(() => {
    const groupedNotes = notes.reduce(
      (sections, currentNote) => {
        if (!sections[currentNote.folder]) {
          sections[currentNote.folder] = [];
        }

        sections[currentNote.folder].push(currentNote);
        return sections;
      },
      {} as Record<string, GenericNote[]>,
    );

    return Object.keys(groupedNotes)
      .sort((keyA) => (keyA === "" ? -1 : 0))
      .map((key) => ({
        title: key === "" ? "Raiz" : key,
        data: groupedNotes[key],
      }));
  }, [notes]);

  return (
    <>
      <SectionList
        sections={sections}
        contentContainerStyle={containerStyle}
        renderSectionHeader={({ section }) => {
          return section.title ? <Separator label={section.title} /> : null;
        }}
        SectionSeparatorComponent={EmptySeparator}
        ItemSeparatorComponent={EmptySeparator}
        ListFooterComponent={footerComponent}
        renderItem={({ item }) => {
          const Component =
            COMPONENT_TYPES[item.type as keyof typeof COMPONENT_TYPES];

          // @ts-ignore
          return <Component {...item} />;
        }}
      />
    </>
  );
}

const EmptySeparator = ({ height = 8 }) => <View style={{ height }} />;
