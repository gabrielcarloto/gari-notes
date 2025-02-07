import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserService } from "./UserService";
import { storage } from "@/firebaseConfig";

export default class StorageService {
  private static userFolder = UserService.getCurrentUserId();

  public static async uploadFile(file: Blob, name: string) {
    const storageRef = ref(storage, this.userFolder + "/" + name);
    const uploadTask = await uploadBytes(storageRef, file);

    return await getDownloadURL(uploadTask.ref);
  }
}
