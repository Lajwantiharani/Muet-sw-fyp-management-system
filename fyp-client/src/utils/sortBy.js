const sortBy = (array = [], key, direction = "asc", isDate = false) => {
    if (!key) return array;

    if (array.length == 0) return array;

    const getValue = (obj, path) => path.split(".").reduce((acc, part) => acc?.[part], obj);

    const sorted = [...array].sort((a, b) => {
        const valA = getValue(a, key);
        const valB = getValue(b, key);

        const aValue = isDate ? new Date(valA) : valA;
        const bValue = isDate ? new Date(valB) : valB;

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    return sorted;
};

export default sortBy;