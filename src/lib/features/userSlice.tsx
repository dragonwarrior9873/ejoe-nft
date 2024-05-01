import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
export interface UserState {
  userId: string;
  isConnect: boolean;
  account: string;
  balance: string;
  userName: string;
  userAvatar: string;
}

// Define the initial state using that type
const initialState: UserState = {
  userId: "",
  isConnect: false,
  account: "",
  balance: "",
  userName: "",
  userAvatar: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEthAccount: (state, action: PayloadAction<Partial<UserState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    disconnect: (state) => {
      state.userId = "";
      state.isConnect = false;
      state.account = "";
      state.balance = "";
      state.userName = "";
      state.userAvatar = "";
      localStorage.removeItem("IsNFTMetamaskConnect");
    },
  },
});

export const { setEthAccount, disconnect } = userSlice.actions;

// Selector function to get user state
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
