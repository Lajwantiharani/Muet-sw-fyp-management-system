import { redirect } from "react-router-dom";
import store from "../../app/store";
import { showErrorToast } from "@utils";
import { dashboardData } from "@features";

const dashboardLoader = async () => {
    const state = store.getState();
    const user = state.auth?.user;

    if (!user?._id) {
        showErrorToast("You are not logged in.");
        return redirect("/signin");
    }

    await store.dispatch(dashboardData());
    return null;
};

export default dashboardLoader;