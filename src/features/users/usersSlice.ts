import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../client";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
};

const initialState: User[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("/fakeApi/users");
  return response.data as User[];
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default usersSlice.reducer;
