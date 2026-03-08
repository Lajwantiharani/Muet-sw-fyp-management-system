import { redirect } from "react-router-dom";
import store from "../../app/store";
import { showErrorToast } from "@utils";
import { retrieveSingleProject } from "@features";

const pitchIdeaButtonLoader = async () => {
    const state = store.getState();
    const user = state.auth?.user;
    const projectId = state.projects?.project?._id;

    if (!user?._id) {
        showErrorToast("You are not logged in.");
        return redirect("/signin");
    }

    if (projectId) return { hidePictIdeaButton: true };

    const res = await store.dispatch(retrieveSingleProject(user._id));

    if (retrieveSingleProject.rejected.match(res)) {
        return { hidePictIdeaButton: false };
    }

    if (retrieveSingleProject.fulfilled.match(res)) {
        return { hidePictIdeaButton: true };
    }

    return { hidePictIdeaButton: false };
};

export default pitchIdeaButtonLoader;
