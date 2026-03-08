import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@utils";
import { setErrors } from "./uiSlice";

const initialState = {
    projects: [],
    project: {},
    pagination: {},
    loading: false,
}

export const retrieveProjects = createAsyncThunk("projects/retrieveProjects",
    async ({ page, status }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post(`/projects/retrieve/${status}`, { page }, { showSuccessToast: false });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const createProject = createAsyncThunk("project/createProject",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiRequest.post("/projects", formData, {
                headers: { "Content-Type": "application/json" }
            })
            return data
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors))
            return rejectWithValue(error.response?.data)
        }
    }
)

export const updateProject = createAsyncThunk("project/updateproject",
    async ({ id, formData, showSuccessToast = true }, { rejectWithValue, dispatch }) => {
        try {
            const { data } = await apiRequest.patch(`/projects/${id}`, formData,
                { showSuccessToast }
            )
            return data
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data)
        }
    }
)

export const uploadProjectFile = createAsyncThunk("project/uploadProjectFile",
    async ({ projectId, formData }, { rejectWithValue, dispatch }) => {
        try {
            console.log("Form Data: ", formData.entries());
            const { data } = await apiRequest.patch(`/projects/proposal-file/${projectId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data
        } catch (error) {
            dispatch(setErrors(error.response?.data?.errors));
            return rejectWithValue(error.response?.data)
        }
    }
)

export const retrieveSupervisorProjects = createAsyncThunk("project/retrieveSupervisorProjects",
    async ({ page, supervisorId, status }, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.post(`/projects/s/${supervisorId}/${status}`, { page }, { showSuccessToast: false })
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const retrieveSingleProject = createAsyncThunk("project/getOneSpecific",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.get(`/projects/${id}`, { showToast: false })
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const deleteProject = createAsyncThunk("project/deleteproject",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await apiRequest.delete(`/projects/${id}`)
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }

)

const projectSlice = createSlice({
    name: "project",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.pagination = action.payload.pagination
            })
            .addCase(retrieveProjects.rejected, (state) => {
                state.loading = false
            })

            .addCase(createProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = [action.payload, ...state.projects]
            })
            .addCase(createProject.rejected, (state) => {
                state.loading = false;
            })

            .addCase(updateProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(project => project._id == action.payload.project._id);
                if (index != -1) {
                    state.projects[index] = action.payload.project
                }
                state.loading = false;
            })
            .addCase(updateProject.rejected, (state) => {
                state.loading = false;
            })

            .addCase(uploadProjectFile.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadProjectFile.fulfilled, (state, action) => {
                state.project = action.payload.project;
                state.loading = false;
            })
            .addCase(uploadProjectFile.rejected, (state) => {
                state.loading = false;
            })

            .addCase(retrieveSupervisorProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveSupervisorProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects;
                state.pagination = action.payload.pagination;
            })
            .addCase(retrieveSupervisorProjects.rejected, (state) => {
                state.loading = false
            })

            .addCase(retrieveSingleProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(retrieveSingleProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload.project;

            })
            .addCase(retrieveSingleProject.rejected, (state) => {
                state.loading = false
            })

            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter((project) => project._id !== action.payload._id)
            })
            .addCase(deleteProject.rejected, (state) => {
                state.loading = false
            })


    }
})
export default projectSlice.reducer