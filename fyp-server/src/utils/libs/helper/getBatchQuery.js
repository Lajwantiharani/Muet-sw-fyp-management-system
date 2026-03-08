const getBatchQuery = (type = "current", extraFilter = {}) => {
    const now = new Date();
    const pitchingMonth = 7;
    const finalizeMonth = 10;

    let batchStart, batchEnd;

    if (now.getMonth() >= pitchingMonth) {
        batchStart = new Date(now.getFullYear(), pitchingMonth, 1);
        batchEnd = new Date(now.getFullYear() + 1, finalizeMonth, 30);
    } else {
        batchStart = new Date(now.getFullYear() - 1, pitchingMonth, 1);
        batchEnd = new Date(now.getFullYear(), finalizeMonth, 30);
    }

    if (type === "past") {
        return { ...extraFilter, createdAt: { $lt: batchStart } };
    }

    return {
        ...extraFilter,
        createdAt: { $gte: batchStart, $lte: batchEnd }
    };
}

export default getBatchQuery;