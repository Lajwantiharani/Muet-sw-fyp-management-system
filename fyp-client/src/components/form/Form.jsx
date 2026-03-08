import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "@features";
import { registerFormHelpers } from "./formState";

const Form = ({ children, onSubmit, resolver, defaultValues = {}, resolverMode, ...props }) => {
    const dispatch = useDispatch();
    const { errors } = useSelector((state) => state.ui);
    const methods = useForm({ defaultValues, resolver, mode: resolverMode ?? "onTouched" });

    registerFormHelpers(methods);

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);

    useEffect(() => {
        if (errors) Object.entries(errors).forEach(([field, message]) => {
            methods.setError(field, { type: "server", message });
        });
    }, [errors, methods]);

    const handleFormSubmit = async (data) => {
        await methods.trigger();
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) {
                formData.append(key, data[key][0]);
            } else {
                formData.append(key, value);
            }
        });

        onSubmit(formData);
    };

    return (
        <FormProvider {...methods}>
            <div className="w-full" >
                <form onSubmit={methods.handleSubmit(handleFormSubmit)} noValidate {...props}>
                    {children}
                </form>
            </div>
        </FormProvider>
    );
};

export default Form;
