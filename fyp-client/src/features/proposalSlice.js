import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@utils";
import { setErrors } from "./uiSlice";

const initialState = {
    proposals: [],
    pagination: {},
    loading: false,
}

export const retrieveProposals = createAsyncThunk("proposal/retrieveProposals",
    async ({ status, page }, { rejectWithValue }) => {
        try {
            const response = await apiRequest.post(`/proposals/retrieve/${status}`, { page }, { showSuccessToast: false });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
)

export const createProposal = createAsyncThunk("proposal/createProposal",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiRequest.post("/proposals", formData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data);
        }
    }
)

export const updateProposal = createAsyncThunk("proposal/updateProposal",
    async ({ id, formData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await apiRequest.patch(`/proposals/${id}`, formData);
            return response.data
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data)
        }
    }
)

export const retrieveManyProposal = createAsyncThunk("proposal/retrieveManyProposal",
    async ({ page, proposalId }, { rejectWithValue }) => {
        try {
            const response = await apiRequest.post(`/proposals/${proposalId}`, { page }, { showSuccessToast: false });
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const deleteProposal = createAsyncThunk("proposal/deleteProposal",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiRequest.delete(`/proposals/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

const proposalSlice = createSlice({
    name: "proposals",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveProposals.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveProposals.fulfilled, (state, action) => {
                state.loading = false;
                state.proposals = action.payload.proposals;
                state.pagination = action.payload.pagination
            })
            .addCase(retrieveProposals.rejected, (state) => {
                state.loading = false
            })

            .addCase(createProposal.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProposal.fulfilled, (state, action) => {
                state.loading = false;
                state.proposals = [action.payload.proposal, ...state.proposals];
            })
            .addCase(createProposal.rejected, (state) => {
                state.loading = false;
            })

            .addCase(updateProposal.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProposal.fulfilled, (state, action) => {
                state.loading = false;
                state.proposals = state.proposals.filter(p => p._id != action.meta.arg.id);
            })
            .addCase(updateProposal.rejected, (state) => {
                state.loading = false
            })

            .addCase(retrieveManyProposal.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveManyProposal.fulfilled, (state, action) => {
                state.loading = false;
                state.proposals = action.payload.proposals;
                state.pagination = action.payload.pagination
            })
            .addCase(retrieveManyProposal.rejected, (state) => {
                state.loading = false
            })

            .addCase(deleteProposal.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProposal.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.proposals.findIndex((proposal) => proposal._id == action.meta.arg);
                if (index != -1) {
                    state.proposals.splice(index, 1);
                }
            })
            .addCase(deleteProposal.rejected, (state) => {
                state.loading = false;
            })
    }
});

export default proposalSlice.reducer