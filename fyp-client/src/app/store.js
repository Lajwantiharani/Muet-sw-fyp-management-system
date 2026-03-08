import { uiReducer, authReducer, userReducer, proposalReducer, projectReducer, presentationReducer, meetingsReducer, notificationReducer, pastFypReducer } from "@features";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        notifications: notificationReducer,
        ui: uiReducer,
        auth: authReducer,
        users: userReducer,
        proposals: proposalReducer,
        projects: projectReducer,
        presentations: presentationReducer,
        meetings: meetingsReducer,
        pastFyp: pastFypReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default store;
