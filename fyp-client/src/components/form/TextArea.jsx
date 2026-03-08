import { capitalize } from "@utils";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

const TextArea = ({ name, label, optional, rows = 4, ...props }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const errorMessage = errors[name]?.message;

    return (
        <div className="relative pb-3">
            {label && (
                <label htmlFor={name} className="font-medium">
                    {label} {optional && <em className="text-gray-500">(Optional)</em>}
                </label>
            )}

            <textarea
                id={name}
                rows={rows}
                {...register(name)}
                className={clsx(
                    "input-primary mt-1 block w-full sm:text-sm",
                    {
                        "border-red-400 focus:ring-0": errorMessage,
                    }
                )}
                {...props}
            />

            {errorMessage && (
                <small className="text-sm text-red-600 block mt-1 italic">
                    {capitalize(errorMessage)}
                </small>
            )}
        </div>
    );
};

export default TextArea;
