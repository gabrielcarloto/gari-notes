import { collections } from "@/firebaseConfig";
import {
  addDoc,
  getDocs,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { UserService } from "./UserService";
import {
  AudioNote,
  FirestoreNote,
  Folder,
  GenericNote,
  ImageNote,
  TaskNote,
  TextNote,
} from "@/types/Note";
import StorageService from "./StorageService";
import { FileUtils } from "@/utils/FileUtils";
import { v4 as uuidV4 } from "react-native-uuid/dist/v4";

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

  public static async all(trash: boolean) {
    try {
      const docs = trash
        ? await this.query(where("trash", "==", true))
        : await this.query();

      return docs.toNotes().map((note) => {
        const genericNote: GenericNote = {
          title: note.title,
          type: note.type,
          content: note.content as string,
          description: note.description,
          completed: note.completed,
          folder: note.folder,
          isInTrash: note.trash,
          id: note.id,
        };

        return genericNote;
      });
    } catch (e) {
      console.log("Failed to get all notes: ", e);
      return [];
    }
  }

  public static async allNotes(includeTrash?: boolean) {
    try {
      const docs = await this.query(where("type", "!=", "task"));

      const filtered = includeTrash
        ? docs.toNotes()
        : docs.toNotes().filter((note) => !note.trash);

      return filtered.map((note) => {
        const genericNote: GenericNote = {
          title: note.title,
          type: note.type as any,
          content: note.content,
          description: note.description,
          folder: note.folder,
          isInTrash: note.trash,
          id: note.id,
        };

        return genericNote;
      });
    } catch (e) {
      console.log("Failed to get all notes (notes.): ", e);
      return [];
    }
  }

  public static async allTasks() {
    try {
      const docs = await this.query(where("type", "==", "task"));

      return docs.toNotes().map((note) => {
        const genericNote: TaskNote = {
          title: note.title,
          type: note.type as any,
          content: note.content,
          folder: note.folder,
          isInTrash: note.trash,
          completed: note.completed as boolean,
          id: note.id,
        };

        return genericNote;
      });
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

  public static async createTextNote(
    note: Omit<TextNote, "id">,
  ): Promise<TextNote | null> {
    try {
      const firestoreNote: Omit<FirestoreNote, "id"> = {
        user_id: UserService.getCurrentUserId() as string,
        title: note.title,
        folder: note.folder,
        trash: note.isInTrash,
        type: "text",
        content: note.content,
      };

      const doc = await addDoc(collections.notes, firestoreNote);

      return { id: doc.id, ...note };
    } catch (e) {
      console.log("Failed to create text note: ", e);
      return null;
    }
  }

  public static async createImageNote(
    note: Omit<ImageNote, "id" | "image">,
    imageBlob: Blob,
  ): Promise<ImageNote | null> {
    try {
      const imageId = uuidV4();

      const image = await StorageService.uploadFile(
        imageBlob,
        imageId + "/" + imageBlob.type.split("/")[1],
      );

      const firestoreNote: Omit<FirestoreNote, "id"> = {
        user_id: UserService.getCurrentUserId() as string,
        title: note.title,
        folder: note.folder,
        trash: note.isInTrash,
        type: "image",
        content: image,
        description: note.description,
      };

      const doc = await addDoc(
        collections.notes,
        JSON.parse(JSON.stringify(firestoreNote)),
      );

      return { id: doc.id, ...note };
    } catch (e) {
      console.log("Failed to create image note: ", e);
      return null;
    }
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
      toNotes: () =>
        snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as FirestoreNote,
        ),
    };
  }
}
