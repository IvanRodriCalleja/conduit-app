import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    example: (state = null) => state,
  },
});

export default store;
