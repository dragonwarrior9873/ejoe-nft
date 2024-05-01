import axios, { AxiosResponse } from "axios";

// Define types for the functions
type FileUploadResponse = any; // Define the specific response type for file upload if known
type UserProfileResponse = any; // Define the specific response type for user profile API if known
type UserDetailsResponse = any; // Define the specific response type for user details API if known
type TopCreatorsResponse = any; // Define the specific response type for top creators API if known
type UserFavoriteResponse = any; // Define the specific response type for user favorite API if known

// Function to set profile photo
const checkIsFav = async (EthUser: string, image: string, NFTid: number) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/user/checkIsFav`,
      {
        EthUser,
        NFTid,
        image,
      }
    );
    console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};
const setProfilePhoto = async (
  file: File,
  user: string
): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("EthUser", user);
    formData.append("file", file);

    const response: AxiosResponse<FileUploadResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/addUserProfilePhoto`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};

// Function to set profile details
const setProfileDetails = async (
  formData: any,
  ethAddress: string
): Promise<UserProfileResponse> => {
  const details = {
    ...formData,
    userEthAddress: ethAddress,
  };

  try {
    const response: AxiosResponse<UserProfileResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/addUserProfileDetails`,
      { data: details }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};

// Function to get user name and picture by Ethereum address
const getUserNamePicByEthAddress = async (
  EthUserId: string
): Promise<UserProfileResponse> => {
  try {
    const response: AxiosResponse<UserProfileResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/user`,
      { EthUser: EthUserId }
    );

    console.log(response?.data);
    return response.data?.result;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};

// Function to get user details by Ethereum address
const getUserDetailsByEthAddress = async (
  EthUserId: string
): Promise<UserDetailsResponse> => {
  console.log(EthUserId);

  try {
    const response: AxiosResponse<UserDetailsResponse> = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/${EthUserId}`
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};

// Function to get top creators
const getTopCreators = async (
  limit: number,
  startIndex: number,
  type: string,
  EthAddress: string
): Promise<TopCreatorsResponse> => {
  try {
    const response: AxiosResponse<TopCreatorsResponse> = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/creator/${EthAddress}?limit=${limit}&startIndex=${startIndex}&type=${type}`
    );

    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};

// Function to get user favorite by Ethereum address
const getUserFavoriteByEthAddress = async (
  EthUserId: string
): Promise<UserFavoriteResponse> => {
  try {
    const response: AxiosResponse<UserFavoriteResponse> = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getUserFavoriteByEthAddress`,
      { EthUser: EthUserId }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled elsewhere if necessary
  }
};
const addNFTFavorite = async (
  EthUser: string,
  NFTData: any
): Promise<UserFavoriteResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user${
        NFTData?.isAuction ? "/addFavAuctionNft" : "/addFavNft"
      }`,
      {
        EthUser,
        NFTData: { NFTid: NFTData?.NFTid, image: NFTData?.image },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// Export functions
export {
  checkIsFav,
  setProfilePhoto,
  getTopCreators,
  setProfileDetails,
  getUserNamePicByEthAddress,
  getUserDetailsByEthAddress,
  getUserFavoriteByEthAddress,
  addNFTFavorite,
};
