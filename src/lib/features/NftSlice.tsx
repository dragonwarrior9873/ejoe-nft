import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
export interface NFTState {
  TradingNFTs: any[];
  apply: number;
  rangePrices: [number, number];
  saleTypes: string[];
}

// Define the initial state using that type
const initialState: NFTState = {
  TradingNFTs: [],
  apply: 0,
  rangePrices: [0.00001, 10],
  saleTypes: ["Buy now"],
};

export const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    // Define an action to set the rangePrices state
    setRangePrices: (state, action: PayloadAction<[number, number]>) => {
      state.rangePrices = action.payload; // Update the rangePrices state
    },
    handleTradingNFTS: (state, action: PayloadAction<any[]>) => {
      state.TradingNFTs = action.payload; // Update the rangePrices state
    },
    applyChanges: (state) => {
      state.TradingNFTs = [];
      state.apply = state.apply + 1; // Update the rangePrices state
    },
    setSaleTypes: (state, action: PayloadAction<string[]>) => {
      state.saleTypes = action.payload;
    },
  },
});

export const { setRangePrices, applyChanges, setSaleTypes, handleTradingNFTS } =
  nftSlice.actions;

// Selector function to get the `nft` state
export const selectNFT = (state: RootState) => state.nft;

export default nftSlice.reducer;
