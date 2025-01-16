import { ITradeAssets } from "@interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { forex } from "pages/private/platform/platformMenus/assets/assetsData";

export interface AssetPairSliceState {
    assetPairs: ITradeAssets[],
    selectedAsset: ITradeAssets
};

const defaultAssetPair: ITradeAssets = forex[0];

const initialState: AssetPairSliceState = {
    assetPairs: [],
    selectedAsset: defaultAssetPair
};

export  const assetPairSlice = createSlice({
    name: "asset-pairs",
    initialState,
    reducers: {
    
        setAssetPairs: (state, action: PayloadAction<ITradeAssets>) => {
            const found = state.assetPairs.find(pair => pair.name == action.payload.name)
            const exist  = found != undefined
            if (!exist){
                state.assetPairs.push(action?.payload);
            }else{
                state.selectedAsset = action?.payload;
            }
            return state
        },

        removeAssetPair: (state, action: PayloadAction<ITradeAssets>) => {
            const index = state?.assetPairs?.findIndex(item => item.name === action?.payload?.name);
            
            state.assetPairs = state?.assetPairs?.filter(pair => pair.name !== action?.payload?.name);
            return state;
        },

        setSelectedAssetPair: (state, action: PayloadAction<ITradeAssets>) => {
            state.selectedAsset = action?.payload
            return state;
        },

    }
})


export const { setAssetPairs, removeAssetPair, setSelectedAssetPair } = assetPairSlice.actions;

export default assetPairSlice.reducer;