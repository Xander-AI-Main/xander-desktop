import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  datasetRef: '',
  task: '',
  file: '',
  modelName: ''
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
    updateModel: (state, action) => {
      state.modelName = action.payload
    },
  },
});

export const { updateDatasetRef, updateTask, updateFile, updateModel } = appSlice.actions;
export default appSlice.reducer;
