import AuthGuard from "@/components/AuthGuard";
import ScreenContainer from "@/components/ScreenContainer";
import { useCallback, useState } from "react";
import { NoteService } from "@/services/NoteService";
import { useFocusEffect } from "expo-router";
import { GenericNote } from "@/types/Note";
import NoteList from "@/components/NoteList";

function TrashBinScreen() {
  const [notes, setNotes] = useState<GenericNote[]>([]);

  const getNotes = useCallback(() => {
    NoteService.all(true).then(setNotes);
  }, []);

  useFocusEffect(getNotes);

  return <NoteList notes={notes} />;
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
