import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  datasetRef: '',
  task: '',
  file: ''
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
    updateFile: (state, action) => {
      state.file = action.payload
    },
  },
});

export const { updateDatasetRef, updateTask, updateFile } = appSlice.actions;
export default appSlice.reducer;
