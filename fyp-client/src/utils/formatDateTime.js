const formateDateTime = (date, withTime = false) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = undefined;
        options.timeZone = 'UTC';
    }

    const formatDate = new Date(date);
    return formatDate.toLocaleString(undefined, options);
}

export default formateDateTime;
