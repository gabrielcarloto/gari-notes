export interface Note {
  id: string;
  title: string;
  folder: string;
  isInTrash: boolean;
  type: "text" | "audio" | "image" | "task";
  content: string;
}

export interface TextNote extends Note {
  type: "text";
}

export interface AudioNote extends Note {
  type: "audio";
  duration: number;
}

export interface ImageNote extends Note {
  type: "image";
  description?: string;
}

export interface TaskNote extends Note {
  type: "task";
  completed: boolean;
}

type RemoveNoteProps<T extends Note> = Partial<Omit<T, keyof Note>>;

export type GenericNote = Note &
  RemoveNoteProps<TextNote> &
  RemoveNoteProps<AudioNote> &
  RemoveNoteProps<ImageNote> &
  RemoveNoteProps<TaskNote>;

export type Folder = { name: string; id: string };

export interface FirestoreFolder {
  name: string;
  user_id: string;
}

export type FirestoreNote = {
  id: string;
  user_id: string;
  title: string;
  folder: string;
  trash: boolean;
  type: Note["type"];
  content: string;
  description?: string;
  completed?: boolean;
  duration?: number;
};
