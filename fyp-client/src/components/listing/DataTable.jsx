import { Pagination, SearchBar, Table } from '@components';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';

export const DataTable = ({
    onChange,
    retrieve,
    recordList,
    paginationData,
    searchableFields,
    recordFields,
    empty,
    contentOnly = false,
    actions,
    hrefs = [],
    isLoading = false,
    wrap = false,
    onRowClick = null,
}) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState({ current: 1, size: 10, query: {}, sort: { createdAt: -1 } });
    const retrieveKey = useMemo(() => JSON.stringify(retrieve ?? {}), [retrieve]);

    useEffect(() => {
        (async () => {
            const parsedRetrieve = JSON.parse(retrieveKey);
            const data = { page, ...parsedRetrieve };
            await dispatch(onChange(data));
        })();
    }, [page, retrieveKey, dispatch, onChange]);


    return <div className={clsx("bg-primary overflow-x-auto shadow-sm", { "p-5 border rounded-lg border-primary": !contentOnly })}>
        {!contentOnly && (
            <SearchBar
                fields={searchableFields}
                set={(query) => setPage((p) => ({ ...p, query }))}
            />
        )}

        <Table
            // isLoading={isLoading}
            hrefs={hrefs}
            records={recordList}
            fields={recordFields}
            actions={actions}
            empty={empty}
            isLoading={isLoading}
            wrap={wrap}
            onRowClick={onRowClick}
            onSort={(sort) => setPage((p) => ({ ...p, sort }))}
        />

        {!contentOnly && (
            <Pagination
                onSort={(size) => setPage((p) => ({ ...p, size, current: 1 }))}
                data={paginationData}
                set={(current) => setPage((p) => ({ ...p, current }))}
            />
        )}
    </div>
}

export default DataTable;
