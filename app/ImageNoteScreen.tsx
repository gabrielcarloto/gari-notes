import NoteScreen from "@/screens/NoteScreen";
import { ImageNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Optional } from "@/types/utils";
import { NoteService } from "@/services/NoteService";
import { Image } from "expo-image";

export default function ImageNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(Boolean(params));
  const [image, setImage] = useState<string>();
  const [noteData, setNoteData] = useState<Optional<ImageNote>>(params ?? {});
  const [showViewfinder, setShowViewfinder] = useState(!Boolean(noteData.id));

  useEffect(() => {
    if (!params.id) return;

    NoteService.get(params.id).then((note) => {
      if (note) {
        setNoteData(note as ImageNote);
        setImage(note.content);
      }
    });
  }, [params.id]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        saved={saved}
        setSaved={setSaved}
        onSaveNote={async (genericData) => {
          const noteObject = {
            ...noteData,
            ...genericData,
          } as ImageNote;

          const imageData = await fetch(image!);
          const note = await NoteService.createImageNote(
            noteObject,
            await imageData.blob(),
          );

          return Boolean(note);
        }}
        {...params}
      >
        {!showViewfinder ? (
          <TouchableOpacity onPress={() => setShowViewfinder(true)}>
            <Image
              source={image}
              style={{ height: 200, width: "100%" }}
              cachePolicy={"memory-disk"}
            />
          </TouchableOpacity>
        ) : (
          <Viewfinder
            showCancelButton={"content" in noteData}
            onDismiss={() => setShowViewfinder(false)}
            onTakePicture={(picture) => {
              if (!picture) return;

              setShowViewfinder(false);
              setImage(picture.uri);
              setSaved(false);
            }}
          />
        )}
        {!showViewfinder && (
          <TextInput
            placeholder="Escreva aqui :)"
            value={noteData.description}
            onChangeText={(value) => {
              setNoteData((prev) => ({ ...prev, description: value }));
              setSaved(false);
            }}
            multiline
            textAlignVertical="top"
          />
        )}
      </NoteScreen>
    </>
  );
}

function Viewfinder({
  onTakePicture,
  onDismiss,
  showCancelButton,
}: {
  onTakePicture: (v: { base64: string; uri: string } | null) => void;
  onDismiss: () => void;
  showCancelButton: boolean;
}) {
  const ref = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para acessar a câmera
        </Text>
        <Button onPress={requestPermission}>Conceder Permissão</Button>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ base64: true });
    if (!photo) return;

    onTakePicture({ base64: photo.base64!, uri: photo.uri });
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={ref}>
        <View style={styles.buttonContainer}>
          {showCancelButton ? (
            <Button secondary style={{ flex: 1 }} onPress={onDismiss}>
              Cancelar
            </Button>
          ) : null}
          <Button onPress={takePicture} style={{ flex: 1 }}>
            Tirar Foto
          </Button>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: "auto",
    flexDirection: "row",
    backgroundColor: "white",
    gap: 8,
    padding: 4,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
