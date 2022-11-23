import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const modalTxSlice = createSlice({
  name: 'modalTxSlice',
  initialState: {
    isShow: false,
    title: '',
  },
  reducers: {
    showModalTx: (state, action: PayloadAction<string>) => {
      state.isShow = true;
      state.title = action.payload;
    },
    hideModalTx: (state) => {
      state.isShow = false;
      state.title = '';
    },
  },
});

export const { showModalTx, hideModalTx } = modalTxSlice.actions;
export default modalTxSlice.reducer;
