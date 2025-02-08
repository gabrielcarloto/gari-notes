import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { UserService } from "./UserService";
import { config, storage } from "@/firebaseConfig";
import invariant from "@/utils/invariant";

export default class StorageService {
  public static async uploadFile(file: Blob, name: string) {
    try {
      const path = invariant(UserService.getCurrentUserId()) + "/" + name;
      const storageRef = ref(storage, path);

      const uploadTask = await uploadBytes(storageRef, file);
      return await getDownloadURL(uploadTask.ref);
    } catch (e) {
      console.log("Failed to upload file: ", e);
      return null;
    }
  }

  public static async deleteFile(link: string) {
    try {
      const storageRef = ref(storage, this.getPathFromLink(link));
      deleteObject(storageRef);
      return true;
    } catch (e) {
      console.log("Failed to ");
      return false;
    }
  }

  private static getPathFromLink(link: string) {
    const regex = new RegExp(
      `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/([^?]*)`,
    );

    const match = link.match(regex)?.at(1);
    return match ? decodeURIComponent(match) : link;
  }
}
