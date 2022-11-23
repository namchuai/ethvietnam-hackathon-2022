import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
  },
  reducers: {
    setInformationUser: (state, payload) => {
      state.userId = payload.payload.userId;
    },
  },
});

export const { setInformationUser } = authSlice.actions;
export default authSlice.reducer;
