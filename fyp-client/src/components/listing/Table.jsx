import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import clsx from "clsx";
import { formatTableHref, readObjectValueByPath } from "@utils";
import { Button } from "@components";

const TableHeader = ({ fields, sortState, onSortToggle, hasActions }) => {
    return (
        <thead className="bg-theme">
            <tr>
                {Object.entries(fields).map(([key, label]) => (
                    <th
                        key={key}
                        className={clsx(
                            "px-4 py-3 font-medium uppercase whitespace-nowrap",
                            // index === 0 && "rounded-tl-lg",
                            // index === arr.length - 1 && !hasActions && "rounded-tr-lg"
                        )}
                    >
                        <div
                            className="flex items-center space-x-1 cursor-pointer select-none"
                            onClick={() => onSortToggle(key)}
                        >
                            <span className="">{label}</span>
                            <div className="flex flex-col text-[10px]">
                                {sortState[key] !== "asc" && (
                                    <FaChevronUp />
                                )}
                                {sortState[key] !== "desc" && (
                                    <FaChevronDown />
                                )}
                            </div>
                        </div>
                    </th>
                ))}
                {hasActions && (
                    <th className="px-4 py-3 font-medium uppercase rounded-tr-lg">
                        ACTION
                    </th>
                )}
            </tr>
        </thead>
    );
};

const Table = ({ fields, records, actions, onSort, empty, isLoading, hrefs, ...prop }) => {
    const [sortState, setSortState] = useState({});

    const handleSortToggle = (field) => {
        const current = sortState[field];
        const next = current === "asc" ? "desc" : "asc";
        setSortState({ [field]: next });
        onSort({ [field]: next });
    };

    return (
        <div className="overflow-x-auto rounded-lg bg-primary">
            <table {...prop} className="min-w-full text-sm text-left">
                <TableHeader
                    fields={fields}
                    sortState={sortState}
                    onSortToggle={handleSortToggle}
                    hasActions={!!actions}
                />

                <tbody className="dark:divide-[rgba(255,255,255,0.05)]">
                    {(records.length > 0 && !isLoading) ? (
                        records.map((record, rowIndex) => (
                            <tr
                                key={record._id}
                                className={clsx(
                                    "transition-all duration-200 group hover:!bg-[#2564eb1a]",
                                    rowIndex % 2 === 0 ? "bg-primary" : "bg-primary-hover border rounded"
                                )}
                            >
                                {Object.keys(fields).map((field) => (
                                    <td
                                        key={field}
                                        className={clsx(
                                            "px-4 py-0 text-sm text-primary ",
                                            "bg-inherit truncate overflow-hidden whitespace-nowrap max-w-[170px]"
                                        )}
                                        title={(!hrefs.includes(field) && (readObjectValueByPath(record, field)) || "-")}
                                    >
                                        {hrefs.includes(field) && (() => {
                                            const [href, hrefText] = formatTableHref(field, readObjectValueByPath(record, field), record);
                                            return (
                                                href != "#"
                                                    ? <Button className="text-sm" href={href} target="_blank">{hrefText}</Button>
                                                    : <em>{hrefText}</em>
                                            );
                                        })()}

                                        {!hrefs.includes(field) && (
                                            `${readObjectValueByPath(record, field) ?? "-"}`
                                        )}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-4 py-1.5 whitespace-nowrap flex items-center gap-2 bg-inherit">
                                        {actions.map(({ label, icon, ShowWhen, onClick }) => {
                                            const key = Object.keys(ShowWhen)[0];
                                            if (record[key] == ShowWhen[key] || ShowWhen[key] === true) {
                                                return (
                                                    <Button key={label} onClick={() => onClick(record._id, label)} className="text-xs button-secondary hover:bg-theme" >
                                                        {icon} {label}
                                                    </Button>
                                                );
                                            }
                                        })}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        isLoading ? (
                            <tr>
                                <td
                                    colSpan={Object.keys(fields).length + (actions ? 1 : 0)}
                                    className="p-4"
                                >
                                    <div className="w-full flex justify-center items-center">
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
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td
                                    colSpan={Object.keys(fields).length + (actions ? 1 : 0)}
                                    className="px-4 py-5 text-center italic text-secondary"
                                >
                                    {empty ?? "Nothing to show!"}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default Table;
