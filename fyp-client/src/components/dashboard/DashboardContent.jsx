import { Helmet } from "react-helmet-async";
import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMetadata } from "@features";

const DashboardContent = ({ title = "FYP Management System", description = "", children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMetadata({ title, description }));
    }, [title, description, dispatch]);

    return (
        <Fragment>
            <Helmet>
                <html lang="en" />
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>

            <div className="m-5 mb-20" >
                <div className="relative">{children}</div>
            </div>
        </Fragment>
    );
};

export default DashboardContent;
