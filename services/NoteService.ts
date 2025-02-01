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

export class NoteService {
  public static async allFolders(): Promise<Folder[] | null> {
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

  public static async allNotes() {
    try {
      const docs = await this.query(where("type", "!=", "task"));

      return docs.toNotes().map((note) => {
        const genericNote: TextNote | ImageNote | AudioNote = {
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
