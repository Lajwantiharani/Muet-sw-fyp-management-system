import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ fields, set, ...props }) => {
    const [text, setText] = useState("");
    const [field, setField] = useState("*");
    const debouncedSet = useMemo(() => debounce((value) => set(value), 500), [set]);

    useEffect(() => {
        return () => debouncedSet.cancel();
    }, [debouncedSet]);

    const handleChange = ({ target }) => {
        const query =
            field === "*"
                ? Object.entries(fields).reduce(
                    (acc, [key]) => ({ ...acc, [key]: target.value }),
                    {}
                )
                : { [field]: target.value };

        setText(target.value);
        debouncedSet(query);
    };

    const handleFieldChange = ({ target }) => {
        setField(target.value);
        const query =
            target.value === "*"
                ? Object.entries(fields).reduce(
                    (acc, [key]) => ({ ...acc, [key]: text }),
                    {}
                )
                : { [target.value]: text };
        set(query);
    };

    return (
        <div className="flex flex-wrap md:flex-nowrap items-center gap-1 w-full mb-4">
            <select
                value={field}
                onChange={handleFieldChange}
                className="w-auto bg-primary border border-primary rounded-l-md p-2 focus:outline-none focus:ring text-sm"
            >
                <option value="*">All Fields</option>
                {Object.entries(fields).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>

            <div className="relative flex-grow">
                <input
                    type="search"
                    value={text}
                    onChange={handleChange}
                    placeholder={
                        field === "*"
                            ? "Search across all fields…"
                            : `Search by ${fields[field].toLowerCase()}…`
                    }
                    className="w-full bg-primary border border-primary rounded-r-md p-2 pr-10 focus:outline-none focus:ring text-sm"
                    {...props}
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none" />
            </div>
        </div>
    );
};

export default SearchBar;
