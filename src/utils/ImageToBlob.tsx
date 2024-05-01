import { ChangeEvent } from "react";

export const ConvertImageToBlob = (file: File): Promise<Blob | string> => {
  return new Promise((resolve) => {
    if (file) {
      readImageAsDataURL(file, (imageDataUrl: string | ArrayBuffer | null) => {
        // Make sure imageDataUrl is a string before using dataURLtoBlob
        if (typeof imageDataUrl === "string") {
          const blobImage = dataURLtoBlob(imageDataUrl);

          // Check for image type and size constraints
          if (!blobImage.type.startsWith("image/")) {
            resolve("Please upload an image file!");
            return;
          }
          const maxFileSize = 30 * 1024 * 1024;
          if (blobImage.size > maxFileSize) {
            // 5MB
            resolve("Image size must be under 5MB!");
            return;
          }

          // Resolve the promise with the blobImage
          resolve(blobImage);
        } else {
          resolve("Error: Could not read image as a data URL");
        }
      });
    } else {
      resolve("Error: No file provided");
    }
  });
};

const readImageAsDataURL = (
  file: File,
  callback: (imageDataUrl: string | ArrayBuffer | null) => void
): void => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const imageDataUrl = reader.result;
    callback(imageDataUrl);
  };

  reader.readAsDataURL(file);
};

const dataURLtoBlob = (dataURL: string): Blob => {
  const [header, data] = dataURL.split(",");
  const byteString = atob(data);
  const mimeType = header.match(/:(.*?);/)?.[1] || "";

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
};
