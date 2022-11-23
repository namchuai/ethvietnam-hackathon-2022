import { createSlice } from '@reduxjs/toolkit';

const modalConnectSlice = createSlice({
  name: 'connectModal',
  initialState: {
    isShow: false,
  },
  reducers: {
    showModalConnect: (state) => {
      state.isShow = true;
    },
    hideModalConnect: (state) => {
      state.isShow = false;
    },
  },
});

export const { showModalConnect, hideModalConnect } = modalConnectSlice.actions;
export default modalConnectSlice.reducer;
