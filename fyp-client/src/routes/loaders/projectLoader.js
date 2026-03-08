import { redirect } from "react-router-dom";
import store from "../../app/store";
import { showErrorToast } from "@utils";
import { retrieveSingleProject } from "@features";

const projectLoader = async () => {
    const state = store.getState();
    const user = state.auth?.user;
    const projectId = state.projects?.project?._id;

    if (!user?._id) {
        showErrorToast("You are not logged in.");
        return redirect("/signin");
    }

    if (projectId) return null;

    const res = await store.dispatch(retrieveSingleProject(user._id));

    if (retrieveSingleProject.rejected.match(res)) {
        showErrorToast("You don't have any project");
        return redirect("/my-ideas");
    }

    if (retrieveSingleProject.fulfilled.match(res)) {
        return null;
    }

    // fallback
    showErrorToast("Failed to load your project.");
    throw new Response("Project not found", { status: 404 });
};

export default projectLoader;
