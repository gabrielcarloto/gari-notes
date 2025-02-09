import NoteScreen from "@/screens/NoteScreen";
import { AudioNote } from "@/types/Note";
import { Stack, useLocalSearchParams } from "expo-router";

import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";
import { Optional } from "@/types/utils";
import { NoteService } from "@/services/NoteService";
import { Alert, Text } from "react-native";
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

export default function AudioNoteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [saved, setSaved] = useState(Boolean(params));
  const [audio, setAudio] = useState<string>();
  const [noteData, setNoteData] = useState<Optional<AudioNote>>(params ?? {});

  const audioRecorderPlayer = useMemo(() => new AudioRecorderPlayer(), []);

  const [audioState, setAudioState] = useState<
    "idle" | "recording" | "playing"
  >("idle");

  const [playbackPosition, setPlaybackPosition] = useState(0);

  useEffect(() => {
    if (!params.id) return;

    NoteService.get(params.id).then((note) => {
      if (note) {
        setNoteData(note as AudioNote);
        setAudio(note.content);
      }
    });
  }, [params.id]);

  async function getPermission() {
    const permissions = [
      // PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      // PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ];

    const results = await checkMultiple(permissions);

    if (
      Object.keys(results).every(
        // @ts-ignore
        (permission) => results[permission] === RESULTS.GRANTED,
      )
    ) {
      return true;
    }

    const requestResults = await requestMultiple(permissions);

    if (
      Object.keys(requestResults).every(
        // @ts-ignore
        (permission) => requestResults[permission] === RESULTS.GRANTED,
      )
    ) {
      return true;
    }

    return false;
  }

  async function checkPermission() {
    const permissionGranted = await getPermission();

    if (!permissionGranted) {
      return Alert.alert("A permissão para gravação é necessária");
    }
  }

  async function startRecording() {
    if (!checkPermission()) return;

    const uri = await audioRecorderPlayer.startRecorder();

    setAudio(uri);
    setAudioState("recording");
    setSaved(false);

    audioRecorderPlayer.addRecordBackListener((e) => {
      setNoteData((prev) => ({ ...prev, duration: e.currentPosition }));
    });
  }

  async function stopRecording() {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setAudioState("idle");
  }

  async function startPlaying() {
    await audioRecorderPlayer.startPlayer(audio);

    setAudioState("playing");
    audioRecorderPlayer.addPlayBackListener((e) => {
      setPlaybackPosition(e.currentPosition);
    });
  }

  async function stopPlaying() {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setAudioState("idle");
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteScreen
        defaultTitle="Áudio sem título"
        onShare={() => {}}
        saved={saved}
        setSaved={setSaved}
        onSaveNote={async (data) => {
          const audioData = audio?.startsWith("file://")
            ? await fetch(audio!)
            : undefined;

          const note = noteData.id
            ? await NoteService.updateAudioNote(
                data as AudioNote,
                await audioData?.blob(),
              )
            : await NoteService.createAudioNote(
                data as AudioNote,
                await audioData!.blob(),
              );

          return Boolean(note);
        }}
        noteData={noteData}
        setNoteData={setNoteData}
      >
        {audio && (
          <Text>
            {audioState === "playing"
              ? audioRecorderPlayer.mmssss(playbackPosition) + " / "
              : ""}
            {audioRecorderPlayer.mmssss(noteData.duration!)}
          </Text>
        )}

        {audio && audioState === "idle" ? (
          <Button onPress={startPlaying}>Ouvir</Button>
        ) : (
          audioState === "playing" && (
            <Button onPress={stopPlaying}>Parar</Button>
          )
        )}

        {audioState === "recording" ? (
          <Button onPress={stopRecording}>Parar</Button>
        ) : (
          <Button onPress={startRecording}>Gravar</Button>
        )}
      </NoteScreen>
    </>
  );
}
