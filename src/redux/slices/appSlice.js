import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  datasetRef: '',
  task: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateDatasetRef: (state, action) => {
      state.datasetRef = action.payload;
    },
    updateTask: (state, action) => {
      state.task = action.payload
    },
  },
});

export const { updateDatasetRef, updateTask } = appSlice.actions;
export default appSlice.reducer;
