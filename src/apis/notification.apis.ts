import axios, { AxiosResponse } from "axios";

const createNotification = async (data: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/notifications`,
      data
    );
    console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};
const getNotification = async (id: string) => {
  try {
    console.log(id);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/notifications/${id}`
    );
    console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};
const seenNotification = async (id: string) => {
  try {
    console.log(id);

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/notifications/${id}`
    );
    console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};

export { createNotification, getNotification, seenNotification };
