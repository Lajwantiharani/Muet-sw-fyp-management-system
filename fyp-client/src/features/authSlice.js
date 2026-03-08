import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest, deleteLocalStorage, readLocalStorage, showSuccessToast, writeLocalStorage } from "@utils";
import { setErrors } from "./uiSlice";

const initialState = {
  user: readLocalStorage("authenticatedUser", true),
  token: readLocalStorage("accessToken"),
  loading: false,
}

export const signin = createAsyncThunk("auth/signin",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await apiRequest.post("/auth/signin", credentials);
      return data;
    } catch (error) {
      dispatch(setErrors(error.response?.data?.errors));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const signup = createAsyncThunk("auth/signup",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await apiRequest.post("/auth/signup", formData);
      return data;
    } catch (error) {
      dispatch(setErrors(error.response?.data?.errors));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const confirmAccount = createAsyncThunk("auth/confirmAccount",
  async ({ token, email }, { rejectWithValue }) => {
    try {
      const { data } = await apiRequest.post("/auth/confirm-account", { token, email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const requestResetPassword = createAsyncThunk("auth/requestResetPassword",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await apiRequest.post("/auth/request-reset-password", formData);
      return data;
    } catch (error) {
      dispatch(setErrors(error.response?.data?.errors));
      return rejectWithValue(error.response?.data);
    }
  }
);
export const resetPassword = createAsyncThunk("auth/resetPassword",
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await apiRequest.patch("/auth/reset-password", formData);
      return data;
    } catch (error) {
      dispatch(setErrors(error.response?.data?.errors));
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verifyToken = createAsyncThunk("auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      if (!readLocalStorage("accessToken")) {
        throw new Error("Token not found");
      };
      const { data } = await apiRequest.get("/auth/verify-token", {
        showSuccessToast: false,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      state.token = null;
      deleteLocalStorage("authenticatedUser", "accessToken");
      showSuccessToast("Singout successfully")
    },
    updateAuthenticatedUser: (state, action) => {
      state.user = action.payload;
      writeLocalStorage("authenticatedUser", action.payload, true);
    },
  },
  extraReducers: (builder) => {
    builder
      // signin
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        writeLocalStorage("authenticatedUser", user, true);
        writeLocalStorage("accessToken", token);
      })
      .addCase(signin.rejected, (state) => {
        state.loading = false;
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
      })

      // confirm account
      .addCase(confirmAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmAccount.rejected, (state) => {
        state.loading = false;
      })

      // request reset password
      .addCase(requestResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestResetPassword.rejected, (state) => {
        state.loading = false;
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.loading = false;
      })

      // verify token
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        deleteLocalStorage("authenticatedUser", "accessToken");
      })
  },
});

export const { signout, updateAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
