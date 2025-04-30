import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import auth from 'firebase/firebase.init';

// Initial state
const initialState = {
  user: null,
  isLoading: false,
  email: '',
  isError: false,
  error: null,
};

// Async Thunks
export const registerUser = createAsyncThunk('auth/registerUser', async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const socialAuth = createAsyncThunk('auth/socialAuth', async (provider, thunkAPI) => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async ({ name, photoUrl }, thunkAPI) => {
  try {
    await updateProfile(auth.currentUser, { displayName: name, photoURL: photoUrl });
    return { ...auth.currentUser };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email, thunkAPI) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Password reset email sent';
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
    builder
      .addCase(socialAuth.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(socialAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(socialAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error?.message;
      });
  },
});

export const { setEmail, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
