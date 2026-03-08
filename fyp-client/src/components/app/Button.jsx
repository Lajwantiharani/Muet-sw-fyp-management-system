import clsx from "clsx";
import { Link } from "react-router-dom";

const loadingSpinner = (
    <svg
        className="w-5 h-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
    </svg>
);

const Button = ({ isLoading, href, children, className, baseClasses = true, ...props }) => {
    const pimaryClasses = "flex items-center justify-center gap-2 button-primary px-4 py-2 rounded-md transition-all text-sm shadow-sm ";
    const linkClasses = "text-link";

    if (href) {
        return (
            <Link to={href} className={clsx(baseClasses ? linkClasses : '', className)} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            disabled={isLoading}
            className={clsx(
                baseClasses ? pimaryClasses : '',
                className,
                { "opacity-70 cursor-not-allowed": isLoading }
            )}
            {...props}
        >
            {isLoading && loadingSpinner}
            {!isLoading && (
                <span className={clsx("flex gap-2 items-center justify-center", { "opacity-70": isLoading })}>{children}</span>
            )}
        </button>
    );
};

export default Button;
