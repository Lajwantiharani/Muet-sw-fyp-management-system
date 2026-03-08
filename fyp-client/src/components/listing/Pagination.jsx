import clsx from "clsx";
import { useState, Fragment } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const Pagination = ({ data, set, onSort }) => {
    const { page, totalPages } = data;
    const [currentPage, setCurrentPage] = useState(page || 1);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        set(newPage);
        setCurrentPage(newPage);
    };

    const getPageNumbers = () => {
        if (totalPages <= 2) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = new Set([1, totalPages]);

        if (currentPage > 2) pages.add(currentPage - 1);
        pages.add(currentPage);
        if (currentPage < totalPages - 1) pages.add(currentPage + 1);

        return Array.from(pages).sort((a, b) => a - b);
    };

    const pagesToDisplay = getPageNumbers();
    const from = (data.page - 1) * data.perPage + 1;
    const to = Math.min(data.page * data.perPage, data.totalItems);
    const isSingle = from === to;

    return (
        <div className="w-full flex flex-row justify-between items-center gap-y-2 mt-5">

            <div className="flex items-center gap-2 flex-wrap">
                <span className="hidden sm:block text-sm text-secondary">
                    Showing {isSingle ? from : `${from} to ${to}`} of {data.totalItems} records
                </span>
                <select onChange={({ target }) => onSort(target.value)}
                    className="text-xs text-secondary bg-primary border border-primary rounded-md p-1 focus:outline-none focus:ring"
                >
                    {[10, 20, 50, 100].map(range => (
                        <option key={range} value={range}>{`${range}/page`}</option>
                    ))}
                </select>
            </div>

            <div className={clsx("flex justify-center items-center", { hidden: totalPages <= 1 })}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 mx-1 flex items-center justify-center rounded-full disabled:opacity-40 disabled:pointer-events-none hover:bg-[#2564eb2a]"
                >
                    <FaChevronLeft />
                </button>

                {pagesToDisplay.map((num, index) => (
                    <Fragment key={index}>
                        {index > 0 && num !== pagesToDisplay[index - 1] + 1 && (
                            <span className="mx-1">...</span>
                        )}
                        <button
                            onClick={() => handlePageChange(num)}
                            disabled={currentPage === num}
                            className={clsx(
                                "w-8 h-8 mx-1 rounded-full flex items-center justify-center disabled:pointer-events-none hover:bg-[#2564eb2a]",
                                { "bg-theme": currentPage == num }
                            )}
                        >
                            {num}
                        </button>
                    </Fragment>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 mx-1 flex items-center justify-center rounded-full disabled:opacity-40 disabled:pointer-events-none hover:bg-[#2564eb2a]"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
