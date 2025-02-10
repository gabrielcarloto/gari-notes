import ScreenContainer from "@/components/ScreenContainer";
import { View, Alert, Modal, StyleSheet, Dimensions } from "react-native";
import { AddButton, AddButtonOption } from "@/components/AddButton";
import { useCallback, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { NoteService } from "@/services/NoteService";
import { router, useFocusEffect } from "expo-router";
import { GenericNote } from "@/types/Note";
import AuthGuard from "@/components/AuthGuard";
import NoteList from "@/components/NoteList";
import SearchBar from "@/components/SearchBar";

const ADD_BUTTON_SIZE = 48 + 16;

function TasksScreen() {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  const [notes, setNotes] = useState<GenericNote[]>([]);

  const [searchText, setSearchText] = useState("");

  const getNotes = useCallback(() => {
    NoteService.allTasks().then(setNotes);
  }, []);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase())
  );

  useFocusEffect(getNotes);

  return (
    <>
      <SearchBar onSearch={setSearchText} />
      <NoteList
        notes={filteredNotes}
        footerComponent={<View style={{ height: ADD_BUTTON_SIZE + 24 }} />}
        containerStyle={{ paddingHorizontal: 32 }}
      />
      <AddButton>
        <AddButtonOption
          label="Projeto"
          onPress={() => setShowNewFolderDialog(true)}
        />

        <AddButtonOption
          label="Tarefa"
          onPress={() => router.push("/TaskNoteScreen")}
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
              label="Insira o nome do novo projeto"
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
    </>
  );
}

export default function Screen() {
  return (
    <ScreenContainer
      title="Tarefas"
      containerStyle={{ padding: 0, paddingTop: 32 }}
    >
      <AuthGuard>
        <TasksScreen />
      </AuthGuard>
    </ScreenContainer>
  );
}

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
