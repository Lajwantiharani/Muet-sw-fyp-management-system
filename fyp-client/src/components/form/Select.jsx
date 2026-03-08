import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { capEach, capitalize } from "@utils";
import clsx from "clsx";
import { FaAngleDown, FaTimes } from "react-icons/fa";

const Select = ({
    name,
    label,
    placeholder = "Choose one...",
    optional,
    options = [],
    defaultValue,
    removable,
    readonly,
    hasDefault = false,
    ...props
}) => {
    const {
        register,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useFormContext();

    const selectedValue = watch(name);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(options);
    const wrapperRef = useRef(null);
    const dropdownRef = useRef(null);
    const [openDirection, setOpenDirection] = useState("down");

    useEffect(() => {
        if (errors[name]) clearErrors(name);
        if (!selectedValue && !hasDefault) {
            setValue(name, "");
        } else {
            const { value } = options.find(o => o.value == selectedValue) ?? {};
            if (defaultValue == null && !value) {
                setValue(name, "");
            } else if (value) {
                setValue(name, value);
            }
        }
    }, [defaultValue, selectedValue, hasDefault, name, setValue, options, errors, clearErrors]);

    useEffect(() => {
        if (!selectedValue && defaultValue && options.length > 0) {
            const option = options.find(o => o.value == defaultValue);
            if (option) {
                setValue(name, option.value, { shouldDirty: false });
            }
        }

        if (defaultValue == null && !selectedValue) setValue(name, "", { shouldDirty: false });
    }, [defaultValue, selectedValue, options, name, setValue]);

    useEffect(() => {
        const filteredOptions = options.filter((opt) =>
            String(opt.label).toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(filteredOptions);
    }, [search, options]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDropdownToggle = () => {
        const rect = wrapperRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 260;

        const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
        setOpenDirection(shouldOpenUp ? "up" : "down");
        setOpen((prev) => !prev);

        if (!open) {
            setSearch("");
        }
    };

    return (
        <div className="relative pb-3 w-full" ref={wrapperRef}>
            {label && (
                <label htmlFor={name} className="font-medium">
                    {label} <small className="text-gray-500">
                        {optional && "(Optional)"}
                        {readonly && "(Read-only)"}
                    </small>
                </label>
            )}

            <select
                id={name}
                className="absolute opacity-0 pointer-events-none h-0 sm:text-sm"
                {...register(name)}
                defaultValue={selectedValue}
                {...props}
            >
                {!hasDefault || defaultValue == null && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}

                {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <div
                tabIndex={0}
                className={clsx(
                    "input-primary relative mt-1 cursor-pointer",
                    errors[name] && "border-red-400 ring-0",
                    { "pointer-events-none bg-secondary": readonly }
                )}

                onClick={() => {
                    if (!readonly) handleDropdownToggle();
                }}
            >
                <div className="flex justify-between items-center">
                    <span
                        className={clsx(
                            "truncate sm:text-sm",
                            selectedValue ? "text-primary" : "text-secondary"
                        )}
                    >
                        {selectedValue
                            ? capEach(options.find((o) => o.value === selectedValue)?.label)
                            : placeholder}
                    </span>
                    {!readonly && <span className="text-secondary"><FaAngleDown /></span>}
                </div>

                {open && (
                    <div
                        ref={dropdownRef}
                        className={clsx(
                            "absolute z-10 w-full bg-primary border border-primary rounded-lg shadow-lg -ml-4 sm:text-sm",
                            openDirection === "down" ? "mt-2 top-full" : "bottom-full mb-2"
                        )}
                    >
                        {options.length > 9 && (
                            <div className="p-2 border-b border-primary bg-primary">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="input-primary w-full"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}

                        <div className="max-h-52 overflow-y-auto p-2 space-y-1">
                            {!hasDefault && !removable && (
                                <div className="px-3 py-1 rounded text-gray-400 cursor-not-allowed select-none">
                                    {placeholder}
                                </div>
                            )}

                            {removable && (
                                <div className="flex items-center gap-1 justify-start px-3 mt-2 mb-4 rounded text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setValue(name, "");
                                        props.onChange?.({ target: { name, value: "" } });
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <FaTimes /> Deselect
                                </div>
                            )}

                            {filtered.length > 0 ? (
                                filtered.map(({ value: val, label: lbl }) => (
                                    <div
                                        key={val}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setValue(name, val);
                                            props.onChange?.({ target: { name, value: val } });
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className={clsx(
                                            "px-3 py-1 rounded cursor-pointer transition-colors",
                                            "hover:bg-[rgba(37,100,235,0.1)]",
                                            selectedValue === val && "bg-theme text-white"
                                        )}
                                    >
                                        {capEach(lbl)}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-secondary text-center italic">
                                    No options
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {errors[name] && (
                <small className="text-sm text-red-600 block mt-1 italic">
                    {capitalize(errors[name]?.message)}
                </small>
            )}
        </div >
    );
};

export default Select;
