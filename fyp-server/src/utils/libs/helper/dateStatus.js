const dateSatus = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);

    // Remove time portion for accurate day comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (inputDate.getTime() === todayDate.getTime()) {
        return "Today";
    } else if (inputDate < todayDate) {
        return "Expired";
    } else {
        return "Coming";
    }
};

export default dateSatus;
