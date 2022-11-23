import { createSlice } from '@reduxjs/toolkit';

export const errorNetworkSlice = createSlice({
  name: 'errorNetworkSlice',
  initialState: {
    isShowError: false,
  },
  reducers: {
    showModalErrorNetWork: (state) => {
      state.isShowError = true;
    },
    hideModalErrorNetWork: (state) => {
      state.isShowError = false;
    },
  },
});

export const { showModalErrorNetWork, hideModalErrorNetWork } =
  errorNetworkSlice.actions;
export default errorNetworkSlice.reducer;
