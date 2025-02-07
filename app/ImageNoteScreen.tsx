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
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Optional } from "@/types/utils";
import { NoteService } from "@/services/NoteService";

export default function ImageNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<ImageNote>();
  const [saved, setSaved] = useState(Boolean(params));
  const [image, setImage] = useState(params?.content);
  const [noteData, setNoteData] = useState<Optional<ImageNote>>(params ?? {});

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        saved={saved}
        onSaveNote={async (genericData) => {
          const noteObject = {
            ...noteData,
            ...genericData,
          } as ImageNote;

          const imageData = await fetch(image);
          const note = await NoteService.createImageNote(
            noteObject,
            await imageData.blob(),
          );

          return Boolean(note);
        }}
        {...params}
      >
        {image ? (
          <Image source={image} style={{ height: 200, width: "100%" }} />
        ) : (
          <Viewfinder
            onTakePicture={(picture) => {
              if (!picture) return;

              setNoteData((prev) => ({
                ...prev,
                content: "data:image/jpeg," + picture.base64,
              }));

              setImage(picture.uri);
              setSaved(false);
            }}
          />
        )}
        <TextInput
          placeholder="Descrição"
          onChangeText={(desc) => {
            setNoteData((prev) => ({ ...prev, description: desc }));
            setSaved(false);
          }}
        />
      </NoteScreen>
    </>
  );
}

function Viewfinder({
  onTakePicture,
}: {
  onTakePicture: (v: { base64: string; uri: string } | null) => void;
}) {
  const ref = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
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
          <Button onPress={takePicture}>Tirar Foto</Button>
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
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
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
