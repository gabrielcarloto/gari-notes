import NoteScreen from "@/screens/NoteScreen";
import { ImageNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function ImageNoteScreen() {
  // @ts-ignore - o tipo está correto
  const params = useLocalSearchParams<ImageNote>();
  const [saved, setSaved] = useState(Boolean(params));
  const [image, setImage] = useState(params?.content);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Nota sem título"
        onShare={() => {}}
        onSaveNote={() => {}}
        {...params}
      >
        {image ? <Image source={image} style={{height: 200, width: "100%"}}/> : <CameraPermissionView onTakePicture={(picture)=>{if (picture) setImage(picture)}}></CameraPermissionView>}
        <TextInput placeholder="Descrição" />
      </NoteScreen>
    </>
  );
}

function CameraPermissionView({ onTakePicture }: { onTakePicture: (v: string | null) => void }) {
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>
          Conceder Permissão
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    onTakePicture(photo?.uri ?? null);
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
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});