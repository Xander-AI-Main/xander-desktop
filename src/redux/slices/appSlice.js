import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  datasetRef: '',
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateDatasetRef: (state, action) => {
      state.datasetRef = action.payload;
    }
  },
});

export const { updateDatasetRef } = appSlice.actions;
export default appSlice.reducer;
