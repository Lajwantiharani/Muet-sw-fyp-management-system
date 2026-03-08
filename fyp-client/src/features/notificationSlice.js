import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest, showSuccessToast } from "@utils";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
};

export const retrieveNotifications = createAsyncThunk("notifications/retrieveNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiRequest.get("/notifications", { showToast: false });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const markNotificationsAllAsRead = createAsyncThunk("notifications/markNotificationsAllAsRead",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiRequest.get(`/notifications/mark-all-as-read`, { showToast: false });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const markNotificationAsRead = createAsyncThunk("notifications/markNotificationAsRead",
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await apiRequest.get(`/notifications/mark-as-read/${notificationId}`, { showToast: false });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        receiveNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount++;
            showSuccessToast(action.payload.title);
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(retrieveNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;
                state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
            })
            .addCase(retrieveNotifications.rejected, (state) => {
                state.loading = false;
            })

            .addCase(markNotificationsAllAsRead.pending, (state) => {
                state.loading = true;
            })
            .addCase(markNotificationsAllAsRead.fulfilled, (state, action) => {
                // state.loading = false;
                state.notifications = action.payload.notifications;
                state.unreadCount = 0;
            })
            .addCase(markNotificationsAllAsRead.rejected, (state) => {
                state.loading = false;
            })

            .addCase(markNotificationAsRead.pending, (state) => {
                state.loading = true;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.loading = false;
                const { notification } = action.payload;
                state.notifications = state.notifications.map(notif => (
                    notif._id == notification._id ? notification : notif
                ));
                state.unreadCount--;
            })
            .addCase(markNotificationAsRead.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { receiveNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
