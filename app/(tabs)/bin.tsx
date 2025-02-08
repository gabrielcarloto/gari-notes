import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";
import Separator from "@/components/Separator";
import { View, SectionList } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NoteService } from "@/services/NoteService";
import { useFocusEffect } from "expo-router";
import { GenericNote } from "@/types/Note";
import { COMPONENT_TYPES } from "@/utils/componentTypes";

const ADD_BUTTON_SIZE = 48 + 16;

function TrashBinScreen() {
  const [notes, setNotes] = useState<GenericNote[]>([]);

  const getNotes = useCallback(() => {
    NoteService.all(true).then(setNotes);
  }, []);

  useFocusEffect(getNotes);

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
        // contentContainerStyle={{ paddingLeft: 32, paddingRight: 32 }}
        renderSectionHeader={({ section }) => {
          return section.title ? <Separator label={section.title} /> : null;
        }}
        SectionSeparatorComponent={EmptySeparator}
        ItemSeparatorComponent={EmptySeparator}
        ListFooterComponent={() => <EmptySeparator height={ADD_BUTTON_SIZE} />}
        renderItem={({ item }) => {
          // @ts-ignore
          const Component = COMPONENT_TYPES[item.type];
          return <Component {...item} />;
        }}
      />
    </>
  );
}

const EmptySeparator = ({ height = 8 }) => <View style={{ height }} />;

export default function Screen() {
  return (
    <ScreenContainer title="Lixeira">
      <AuthGuard>
        <TrashBinScreen />
      </AuthGuard>
    </ScreenContainer>
  );
}
