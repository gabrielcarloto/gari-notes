import { collections } from "@/firebaseConfig";
import {
  doc,
  addDoc,
  DocumentData,
  documentId,
  getDocs,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { UserService } from "./UserService";
import {
  AudioNote,
  FirestoreNote,
  Folder,
  GenericNote,
  ImageNote,
  Note,
  TaskNote,
  TextNote,
} from "@/types/Note";
import StorageService from "./StorageService";
import { v4 as uuidV4 } from "react-native-uuid/dist/v4";
import invariant from "@/utils/invariant";
import { Optional } from "@/types/utils";

export class NoteService {
  public static async allFolders(): Promise<Folder[]> {
    try {
      const q = query(collections.folders, UserService.userConstraint);

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name,
          id: doc.id,
        };
      });
    } catch (e) {
      console.log("Failed to get all folders: ", e);
      return [];
    }
  }

  public static async all(trash?: boolean) {
    try {
      const docs = await this.query();

      return this.filterTrash(docs.toNotes(), Boolean(trash)).map(
        this.mapToNote,
      );
    } catch (e) {
      console.log("Failed to get all notes: ", e);
      return [];
    }
  }

  public static async get(id: string) {
    try {
      const doc = await this.query(where(documentId(), "==", id));
      return doc.toNotes().map(this.mapToNote)[0];
    } catch (e) {
      console.log("Failed to get note: ", e);
      return null;
    }
  }

  public static async allNotes(includeTrash?: boolean) {
    try {
      const docs = await this.query(where("type", "!=", "task"));

      return this.filterTrash(docs.toNotes(), Boolean(includeTrash)).map(
        this.mapToNote,
      );
    } catch (e) {
      console.log("Failed to get all notes (notes.): ", e);
      return [];
    }
  }

  private static filterTrash(notes: FirestoreNote[], onlyTrashed: boolean) {
    return notes.filter(
      (note) => note.trash === onlyTrashed || (!onlyTrashed && !note.trash),
    );
  }

  public static async allTasks() {
    try {
      const docs = await this.query(where("type", "==", "task"));
      return docs.toNotes().map(this.mapToNote) as TaskNote[];
    } catch (e) {
      console.log("Failed to get all tasks: ", e);
      return [];
    }
  }

  public static async createFolder(name: string): Promise<Folder | null> {
    try {
      const doc = await addDoc(collections.folders, {
        name,
        user_id: UserService.getCurrentUserId(),
      });

      return { id: doc.id, name: name };
    } catch (e) {
      console.log("Failed to create folder: ", e);
      return null;
    }
  }

  private static mapToNote(firestoreNote: FirestoreNote): GenericNote {
    return {
      id: firestoreNote.id,
      type: firestoreNote.type,
      title: firestoreNote.title,
      folder: firestoreNote.folder,
      isInTrash: firestoreNote.trash,
      content: firestoreNote.content,
      description: firestoreNote.description,
      completed: firestoreNote.completed,
      duration: firestoreNote.duration,
      reminder: firestoreNote.reminder
        ? new Date(firestoreNote.reminder)
        : undefined,
    };
  }

  private static mapToFirestoreNote(note: Optional<GenericNote>) {
    const firestoreNote: Omit<FirestoreNote, "id"> & { id?: string } = {
      id: note.id,
      user_id: invariant(UserService.getCurrentUserId()),
      type: invariant(note.type),
      title: invariant(note.title),
      folder: note.folder ?? "",
      trash: note.isInTrash ?? false,
      content: invariant(note.content),
      description: note.description,
      completed: note.completed,
      duration: note.duration,
      reminder: note.reminder,
    };

    return JSON.parse(JSON.stringify(firestoreNote));
  }

  private static async createNote<T extends Note>(data: Omit<T, "id">) {
    try {
      const firestoreNote = this.mapToFirestoreNote(data);
      const doc = await addDoc(collections.notes, firestoreNote);
      return { id: doc.id, ...data };
    } catch (e) {
      console.log("Failed to create note: ", e);
      return null;
    }
  }

  private static async updateNote<T extends Note>(data: T) {
    try {
      const firestoreNote = this.mapToFirestoreNote(Object.assign(data));
      delete firestoreNote.id;

      const docRef = doc(collections.notes, data.id);
      await setDoc(docRef, firestoreNote);
      return data;
    } catch (e) {
      console.log("Failed to update note: ", e);
      return null;
    }
  }

  public static async deleteNote(id: string) {
    try {
      const docRef = doc(collections.notes, id);
      await deleteDoc(docRef);
      return true;
    } catch (e) {
      console.log("Failed to delete note: ", e);
      return false;
    }
  }

  public static async deleteNoteWithContent(id: string, imageUrl: string) {
    if (!StorageService.deleteFile(imageUrl)) return false;
    return this.deleteNote(id);
  }

  public static async createTextNote(note: Omit<TextNote, "id">) {
    return this.createNote<TextNote>(Object.assign(note, { type: "text" }));
  }

  public static async updateTextNote(note: TextNote) {
    return this.updateNote<TextNote>(Object.assign(note, { type: "text" }));
  }

  public static async createTaskNote(note: Omit<TaskNote, "id">) {
    return this.createNote<TaskNote>(Object.assign(note, { type: "task" }));
  }

  public static async updateTaskNote(note: TaskNote) {
    return this.updateNote<TaskNote>(Object.assign(note, { type: "task" }));
  }

  private static async getObjectLink(blob: Blob) {
    const imageId = uuidV4();

    const image = await StorageService.uploadFile(
      blob,
      imageId + "." + blob.type.split("/")[1],
    );

    return invariant(image);
  }

  public static async createImageNote(
    note: Omit<ImageNote, "id" | "content">,
    image: Blob,
  ) {
    return await this.createNote<ImageNote>(
      Object.assign(note, {
        type: "image",
        content: await this.getObjectLink(image),
      }),
    );
  }

  public static async updateImageNote(note: ImageNote, image?: Blob) {
    if (image) {
      StorageService.deleteFile(note.content);

      return await this.updateNote<ImageNote>(
        Object.assign(note, {
          type: "image",
          content: await this.getObjectLink(image),
        }),
      );
    }

    return await this.updateNote<ImageNote>(
      Object.assign(note, {
        type: "image",
        content: note.content,
      }),
    );
  }

  public static async createAudioNote(
    note: Omit<AudioNote, "id" | "content">,
    audio: Blob,
  ) {
    return await this.createNote<AudioNote>(
      Object.assign(note, {
        type: "audio",
        content: await this.getObjectLink(audio),
      }),
    );
  }

  public static async updateAudioNote(note: AudioNote, audio?: Blob) {
    if (audio) {
      StorageService.deleteFile(note.content);

      return await this.updateNote<AudioNote>(
        Object.assign(note, {
          type: "audio",
          content: await this.getObjectLink(audio),
        }),
      );
    }

    return await this.updateNote<AudioNote>(
      Object.assign(note, {
        type: "audio",
        content: note.content,
      }),
    );
  }

  private static docToFirestoreNote(
    doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
  ) {
    return { ...doc.data(), id: doc.id } as FirestoreNote;
  }

  private static async query(...constraints: QueryConstraint[]) {
    const q = query(
      collections.notes,
      UserService.userConstraint,
      ...constraints,
    );
    const snapshot = await getDocs(q);

    return {
      docs: snapshot.docs,
      toNotes: () => snapshot.docs.map(this.docToFirestoreNote),
    };
  }
}
