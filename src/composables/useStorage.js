import { ref } from 'vue';
import { storage } from '../firebase';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';

export function useStorageUpload() {
  const url = ref(null);
  const error = ref(null);
  const isPending = ref(false);

  const uploadImage = async (file, folder = 'images') => {
    isPending.value = true;
    error.value = null;

    const filePath = `${folder}/${file.name}-${Date.now()}`;
    const fileRef = storageRef(storage, filePath);

    try {
      await uploadBytes(fileRef, file);
      url.value = await getDownloadURL(fileRef);
    } catch (err) {
      error.value = err.message;
    }

    isPending.value = false;
  };

  return { url, error, isPending, uploadImage };
}
