import Separator from "@/components/Separator";
import useAuth from "@/hooks/useAuth";
import NoteScreen from "@/screens/NoteScreen";
import { NoteService } from "@/services/NoteService";
import { TaskNote } from "@/types/Note";
import { Optional } from "@/types/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

import * as Calendar from "expo-calendar";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import invariant from "@/utils/invariant";

export default function TextNoteScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id: string }>();

  const [noteData, setNoteData] = useState<Optional<TaskNote>>(
    params ?? { content: "" },
  );
  const [saved, setSaved] = useState(Boolean(params));

  const [savedReminder, setSavedReminder] = useState<Date>();

  useEffect(() => {
    if (!params.id) return;

    NoteService.get(params.id).then((note) => {
      if (note) {
        setNoteData(note as TaskNote);
        setSavedReminder(noteData.reminder);
      }
    });
  }, [params.id]);

  useEffect(() => {
    if (!user?.isPremium) return;
    getCalendarPermission();
  }, []);

  async function getCalendarPermission() {
    const calendar = await Calendar.requestCalendarPermissionsAsync();

    if (!calendar.granted) {
      Alert.alert("Permissão de calendário necessária");
      return false;
    }

    return true;
  }

  async function addReminder() {
    if (!user?.isPremium) {
      return Alert.alert("Recurso disponível apenas para usuários PREMIUM");
    }

    if (!getCalendarPermission()) {
      return;
    }

    DateTimePickerAndroid.open({
      mode: "date",
      value: noteData.reminder ?? new Date(),
      onChange: (_, date) => {
        setNoteData((prev) => ({ ...prev, reminder: date }));
        setSaved(false);
      },
    });
  }

  async function createCalendarEvent() {
    await Calendar.createEventInCalendarAsync({
      title: invariant(noteData.title),
      startDate: invariant(noteData.reminder),
      allDay: true,
    });
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Tarefa sem título"
        onShare={(data) => {
          const title = data.title ? data.title + "\n" : "";
          const reminder = noteData.reminder ? `Data: ${noteData.reminder.toDateString()}\n\n` : "Sem prazo.\n\n";
          return {
            message: title + reminder + (noteData.content ?? ""),
          };
        }}
        setSaved={setSaved}
        onSaveNote={async (genericData) => {
          const noteObject = {
            ...noteData,
            ...genericData,
          } as TaskNote;

          const note = noteData.id
            ? await NoteService.updateTaskNote(noteObject)
            : await NoteService.createTaskNote(noteObject);

          setSavedReminder(note?.reminder);

          if (savedReminder !== note?.reminder) {
            await createCalendarEvent();
          }

          return Boolean(note);
        }}
        saved={saved}
        noteData={noteData}
        setNoteData={setNoteData}
        folderType="project"
      >
        <TouchableOpacity
          style={{ height: 40, justifyContent: "center" }}
          onPress={addReminder}
        >
          <Text>
            {noteData.reminder
              ? noteData.reminder.toDateString()
              : "Adicionar lembrete"}
          </Text>
        </TouchableOpacity>
        <Separator style={{ height: 1 }} />

        <TouchableOpacity
          style={{ height: 40, justifyContent: "center" }}
          onPress={() => {
            setNoteData((prev) => ({ ...prev, completed: !prev.completed }));
            setSaved(false);
          }}
        >
          <Text>
            {noteData.completed ? "Tarefa completa" : "Tarefa incompleta"}
          </Text>
        </TouchableOpacity>
        <Separator style={{ height: 1 }} />

        <TextInput
          placeholder="Descrição da tarefa"
          value={noteData.content}
          onChangeText={(value) => {
            setNoteData((prev) => ({ ...prev, content: value }));
            setSaved(false);
          }}
          style={styles.input}
          multiline
          autoFocus
          textAlignVertical="top"
        />
      </NoteScreen>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});
