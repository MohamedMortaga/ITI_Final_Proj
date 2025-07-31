import { ref } from 'vue';
import { storage } from '../firebase/config';
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';

export function useStorageUpload() {
  const url = ref(null);
  const error = ref(null);
  const isPending = ref(false);

  // File validation function
  const validateFile = (file) => {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit. Please choose a smaller image.');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
    }

    return true;
  };

  // Wait function for retry delays
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Enhanced upload function with retry logic
  const uploadImage = async (file, folder = 'images', maxRetries = 3) => {
    isPending.value = true;
    error.value = null;
    url.value = null;

    try {
      // Validate file before upload
      validateFile(file);

      const filePath = `${folder}/${file.name}-${Date.now()}`;
      const fileRef = storageRef(storage, filePath);

      let lastError;
      
      for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Upload timeout. Please try again.')), 30000); // 30 second timeout
          });

          // Upload with timeout
          const uploadPromise = uploadBytes(fileRef, file);
          await Promise.race([uploadPromise, timeoutPromise]);
          
          // Get download URL
          url.value = await getDownloadURL(fileRef);
          console.log('Upload successful:', url.value);
          break; // Success, exit retry loop
          
        } catch (err) {
          lastError = err;
          console.warn(`Upload attempt ${retryCount} failed:`, err.message);
          
          // If this is the last retry, throw the error
          if (retryCount === maxRetries) {
            throw err;
          }
          
          // Calculate wait time with exponential backoff
          const waitTime = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
          console.log(`Retrying in ${waitTime}ms...`);
          await wait(waitTime);
        }
      }
      
    } catch (err) {
      console.error('Upload failed after all retries:', err);
      
      // Provide user-friendly error messages
      if (err.code === 'storage/retry-limit-exceeded') {
        error.value = 'Upload failed due to network issues. Please check your internet connection and try again.';
      } else if (err.message.includes('timeout')) {
        error.value = 'Upload timed out. Please try again with a smaller image or check your internet connection.';
      } else if (err.message.includes('5MB')) {
        error.value = err.message;
      } else if (err.message.includes('valid image file')) {
        error.value = err.message;
      } else {
        error.value = 'Failed to upload image. Please try again.';
      }
    } finally {
      isPending.value = false;
    }
  };

  // Enhanced multiple images upload function
  const uploadMultipleImages = async (files, folder = 'images', maxRetries = 3) => {
    isPending.value = true;
    error.value = null;
    
    const results = {
      successCount: 0,
      errorCount: 0,
      urls: [],
      errors: []
    };

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Validate file
          validateFile(file);
          
          const filePath = `${folder}/${file.name}-${Date.now()}-${i}`;
          const fileRef = storageRef(storage, filePath);
          
          let uploadSuccess = false;
          let lastError;
          
          // Retry logic for each file
          for (let retryCount = 1; retryCount <= maxRetries; retryCount++) {
            try {
              // Create a timeout promise
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Upload timeout. Please try again.')), 30000);
              });

              // Upload with timeout
              const uploadPromise = uploadBytes(fileRef, file);
              await Promise.race([uploadPromise, timeoutPromise]);
              
              // Get download URL
              const downloadURL = await getDownloadURL(fileRef);
              results.urls.push(downloadURL);
              results.successCount++;
              uploadSuccess = true;
              console.log(`File ${i + 1} uploaded successfully:`, downloadURL);
              break; // Success, exit retry loop
              
            } catch (err) {
              lastError = err;
              console.warn(`File ${i + 1}, attempt ${retryCount} failed:`, err.message);
              
              // If this is the last retry, record the error
              if (retryCount === maxRetries) {
                results.errors.push({
                  file: file.name,
                  error: err.message
                });
                results.errorCount++;
                break;
              }
              
              // Calculate wait time with exponential backoff
              const waitTime = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
              console.log(`Retrying file ${i + 1} in ${waitTime}ms...`);
              await wait(waitTime);
            }
          }
          
          if (!uploadSuccess) {
            console.error(`File ${i + 1} failed after all retries:`, lastError);
          }
          
        } catch (validationError) {
          results.errors.push({
            file: file.name,
            error: validationError.message
          });
          results.errorCount++;
          console.error(`File ${i + 1} validation failed:`, validationError.message);
        }
      }
      
      // Set overall error message if any files failed
      if (results.errorCount > 0) {
        if (results.successCount === 0) {
          error.value = 'All uploads failed. Please check your files and try again.';
        } else {
          error.value = `${results.successCount} files uploaded successfully, ${results.errorCount} failed.`;
        }
      }
      
    } catch (err) {
      console.error('Multiple upload failed:', err);
      error.value = 'Failed to upload images. Please try again.';
    } finally {
      isPending.value = false;
    }
    
    return results;
  };

  return { 
    url, 
    error, 
    isPending, 
    uploadImage, 
    uploadMultipleImages,
    validateFile 
  };
}
