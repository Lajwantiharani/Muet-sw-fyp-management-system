import { redirect } from "react-router-dom";
import store from "../../app/store";
import { confirmAccount } from "@features";

const confirmAccountLoader = async ({ request }) => {
    const url = new URL(request?.url);
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");

    if (!token || !email) return redirect("/404");

    const res = await store.dispatch(confirmAccount({ token, email }));
    if (confirmAccount.fulfilled.match(res)) {
        return { isConfirmed: true };
    }

    return { isConfirmed: false };
};

export default confirmAccountLoader;