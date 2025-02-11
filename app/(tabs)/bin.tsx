import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";
import { useCallback, useState } from "react";
import { NoteService } from "@/services/NoteService";
import { useFocusEffect } from "expo-router";
import { GenericNote } from "@/types/Note";
import NoteList from "@/components/NoteList";
import SearchBar from "@/components/SearchBar";

function TrashBinScreen() {
  const [notes, setNotes] = useState<GenericNote[]>([]);

  const [searchText, setSearchText] = useState("");

  const getNotes = useCallback(() => {
    NoteService.all(true).then(setNotes);
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  useFocusEffect(getNotes);

  return (
    <>
      <SearchBar onSearch={setSearchText} />
      <NoteList notes={filteredNotes} />
    </>
  );
}

export default function Screen() {
  return (
    <ScreenContainer title="Lixeira">
      <AuthGuard>
        <TrashBinScreen />
      </AuthGuard>
    </ScreenContainer>
  );
}
