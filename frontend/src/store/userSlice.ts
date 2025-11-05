import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string;
  hasProfile: boolean;
  hasPersona: boolean;
  currentPersona: string | null;
}

const initialState: UserState = {
  userId: localStorage.getItem('userId') || 'user_' + Date.now(),
  hasProfile: false,
  hasPersona: false,
  currentPersona: null,
};

// 保存userId到localStorage
if (!localStorage.getItem('userId')) {
  localStorage.setItem('userId', initialState.userId);
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      localStorage.setItem('userId', action.payload);
    },
    setHasProfile: (state, action: PayloadAction<boolean>) => {
      state.hasProfile = action.payload;
    },
    setHasPersona: (state, action: PayloadAction<boolean>) => {
      state.hasPersona = action.payload;
    },
    setCurrentPersona: (state, action: PayloadAction<string | null>) => {
      state.currentPersona = action.payload;
    },
  },
});

export const { setUserId, setHasProfile, setHasPersona, setCurrentPersona } = userSlice.actions;
export default userSlice.reducer;





