import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const isBrowser = typeof window !== "undefined";

const initialState: AuthState = {
  user: isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: isBrowser ? localStorage.getItem("accessToken") : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem("accessToken") : false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.loading = false;

      if (isBrowser) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (isBrowser) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
