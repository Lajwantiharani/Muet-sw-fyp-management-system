const dateStatus = (timestamp) => {
    if (!timestamp) return "Expired";

    const date = new Date(timestamp);
    const now = new Date();

    // Extract UTC dates (year, month, date only)
    const inputDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const todayDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    if (inputDate == todayDate) return "Today";
    if (inputDate < todayDate) return "Expired";
    return "Coming";
};

export default dateStatus;
