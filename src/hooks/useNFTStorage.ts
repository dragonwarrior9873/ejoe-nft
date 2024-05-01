import axios, { AxiosResponse } from "axios";

// Define types for the metadata and the API response
interface Metadata {
  itemName: string;
  description: string;
  image: File; // File type since you are appending an image
  property?: Record<string, any>; // Optional properties
  category?: string; // Optional category
}
interface Imagedata {
  EthAddress: string;
  image: string | Blob; // File type since you are appending an image
}
interface NFTResponse {
  value: string; // Assuming the response has a 'value' property containing the CID or other necessary info
}

// Update the function with type annotations
const UploadMetadata = async (metadata: Metadata): Promise<string | null> => {
  console.log(metadata);

  try {
    const url = "https://api.nft.storage/store";

    // Prepare metadata
    const meta = {
      name: metadata.itemName,
      description: metadata.description,
      image: metadata.image, // IPFS URL to the image content
      properties: metadata.property,
      category: metadata.category,
    };

    // Prepare form data
    const formData = new FormData();
    formData.append("meta", JSON.stringify(meta));
    formData.append("image", metadata.image);
    console.log(process.env.NEXT_PUBLIC_NFT_STORAGE_KEY);

    // Make the POST request
    const response: AxiosResponse<NFTResponse> = await axios.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_NFT_STORAGE_KEY as string
          }`,
        },
      }
    );

    // Return the 'value' property from the response data
    return response.data?.value || null;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow error to handle it elsewhere
  }
};
const UploadImage = async (metadata: Imagedata): Promise<string | null> => {
  try {
    const url = "https://api.nft.storage/store";
    // Prepare form data
    const formData = new FormData();
    formData.append(
      "meta",
      JSON.stringify({ EthAddress: metadata.EthAddress })
    );
    formData.append("image", metadata.image);
    // Make the POST request
    const response: AxiosResponse<NFTResponse> = await axios.post(
      url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_NFT_STORAGE_KEY as string
          }`,
        },
      }
    );

    // Return the 'value' property from the response data
    return response.data?.value || null;
  } catch (error) {
    console.error("Error uploading NFT:", error);
    throw error; // Rethrow error to handle it elsewhere
  }
};
export { UploadMetadata, UploadImage };
