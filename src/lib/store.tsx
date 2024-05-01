import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import { nftSlice } from "./features/NftSlice";

// Function to create a new store instance
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userSlice,
      nft: nftSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Creating a store
export const store = makeStore();

// Infer the type of the store
export type AppStore = ReturnType<typeof makeStore>;

// Infer the type of the state from the store
export type RootState = ReturnType<AppStore["getState"]>;

// Infer the type of the dispatch function from the store
export type AppDispatch = AppStore["dispatch"];
