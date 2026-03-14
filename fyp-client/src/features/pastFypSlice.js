import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@utils";
import { setErrors } from "./uiSlice";

const initialState = {
    pastFyps: [],
    pagination: {},
    loading: false,
    uploading: false,
    excelProjects: [],
    excelPagination: {},
    excelLoading: false,
};

export const retrievePastFyps = createAsyncThunk("pastFyp/retrievePastFyps",
    async ({ page }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post("/past-fyps/retrieve", { page }, { showSuccessToast: false });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const uploadPastFypPdf = createAsyncThunk("pastFyp/uploadPastFypPdf",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiRequest.post("/past-fyps/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data);
        }
    }
);

export const backfillPastFyps = createAsyncThunk("pastFyp/backfillPastFyps",
    async ({ overwrite = false } = {}, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post("/past-fyps/backfill", { overwrite });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const retrieveImportedProjects = createAsyncThunk("pastFyp/retrieveImportedProjects",
    async ({ page }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post("/import-projects/retrieve", { page }, { showSuccessToast: false });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const pastFypSlice = createSlice({
    name: "pastFyp",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrievePastFyps.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrievePastFyps.fulfilled, (state, action) => {
                state.loading = false;
                state.pastFyps = action.payload.pastFyps ?? action.payload.fypProjects ?? [];
                state.pagination = action.payload.pagination ?? {};
            })
            .addCase(retrievePastFyps.rejected, (state) => {
                state.loading = false;
            })

            .addCase(uploadPastFypPdf.pending, (state) => {
                state.uploading = true;
            })
            .addCase(uploadPastFypPdf.fulfilled, (state, action) => {
                state.uploading = false;
                const record = action.payload.pastFyp;
                const index = state.pastFyps.findIndex((item) => item._id === record._id);
                if (index >= 0) state.pastFyps[index] = record;
                else state.pastFyps.unshift(record);
            })
            .addCase(uploadPastFypPdf.rejected, (state) => {
                state.uploading = false;
            })

            .addCase(backfillPastFyps.pending, (state) => {
                state.uploading = true;
            })
            .addCase(backfillPastFyps.fulfilled, (state) => {
                state.uploading = false;
            })
            .addCase(backfillPastFyps.rejected, (state) => {
                state.uploading = false;
            })

            .addCase(retrieveImportedProjects.pending, (state) => {
                state.excelLoading = true;
            })
            .addCase(retrieveImportedProjects.fulfilled, (state, action) => {
                state.excelLoading = false;
                const records = action.payload.importProjects ?? [];
                state.excelProjects = records.map((record) => ({
                    ...record,
                    supervisorName: record.supervisor?.name ?? "-",
                    membersLabel: (record.group?.members ?? []).map((m) => m.name).join(", "),
                }));
                state.excelPagination = action.payload.pagination ?? {};
            })
            .addCase(retrieveImportedProjects.rejected, (state) => {
                state.excelLoading = false;
            });
    }
});

export default pastFypSlice.reducer;
