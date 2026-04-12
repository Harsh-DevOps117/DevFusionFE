import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const isBrowser = typeof window !== "undefined";

const initialState: AuthState = {
  user: isBrowser ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: isBrowser ? localStorage.getItem("token") : null,
  isAuthenticated: isBrowser ? !!localStorage.getItem("token") : false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>,
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      state.loading = false;

      // We save it as "token" so the API Interceptor can find it
      if (isBrowser) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (isBrowser) {
        localStorage.removeItem("token");
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
