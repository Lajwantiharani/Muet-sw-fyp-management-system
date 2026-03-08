import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@utils";
import { setErrors } from "./uiSlice";

const initialState = {
    meetings: [],
    pagination: {},
    signature: null,
    loading: false,
    meeting: null
}
export const retrieveMeetings = createAsyncThunk("meeting/retrieveMeetings",
    async ({ page, status }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post(`/meetings/retrieve/${status}`, { page }, { showSuccessToast: false });
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const createMeeting = createAsyncThunk("meeting/createMeeting",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiRequest.post("/meetings", formData, {
                headers: { "Content-type": "application/json" }
            })
            return data
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors))
            return rejectWithValue(error.response?.data)
        }
    }
)

export const updateMeeting = createAsyncThunk("meeting/updateMeeting",
    async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiRequest.patch(`/meetings/${id}`, updatedData);
            return (data)
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data)
        }
    }
)

export const projectSpecificMeetings = createAsyncThunk("meeting/projectSpecificMeetings",
    async ({ projectId, studentId, page }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post(`/meetings/p/${projectId ?? studentId}`, { page }, { showSuccessToast: false });
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const getOneMeeting = createAsyncThunk("meeting/getOneMeeting",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.get(`/meetings/${id}`, { showSuccessToast: false });
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const deleteMeeting = createAsyncThunk("meeting/deleteMeeting",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.delete(`/meetings/${id}`);
            return data
        }
        catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const generateSignature = createAsyncThunk("meeting/generateSignature",
    async ({ id, meetingId, role }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post(`/meetings/generate-signature`, { id, meetingId, role }, { showToast: false });
            return data
        }
        catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)
const meetingSlice = createSlice({
    name: "meetings",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveMeetings.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload.meetings;
                state.pagination = action.payload.pagination;
            })
            .addCase(retrieveMeetings.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = [action.payload.meeting, ...state.meetings]
            })
            .addCase(createMeeting.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updateMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meeting = action.payload;
            })
            .addCase(updateMeeting.rejected, (state) => {
                state.loading = false
            })
            .addCase(projectSpecificMeetings.pending, (state) => {
                state.loading = true;
            })
            .addCase(projectSpecificMeetings.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = action.payload.meetings;
                state.pagination = action.payload.pagination;
            })
            .addCase(projectSpecificMeetings.rejected, (state) => {
                state.loading = false;
            })
            .addCase(getOneMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOneMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meeting = action.payload
            })
            .addCase(getOneMeeting.rejected, (state) => {
                state.loading = false
            })
            .addCase(deleteMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.meetings = state.meetings.filter((meeting) => meeting._id != action.meta.arg);
            })
            .addCase(deleteMeeting.rejected, (state) => {
                state.loading = false;
            })
            .addCase(generateSignature.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateSignature.fulfilled, (state, action) => {
                state.loading = false;
                state.signature = action.payload.signature;
            })
            .addCase(generateSignature.rejected, (state) => {
                state.loading = false;
            })
    }
});
export default meetingSlice.reducer;

