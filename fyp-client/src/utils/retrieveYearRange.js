const retrieveYearRange = (min = 2000) => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let year = currentYear; year >= min; year--) {
        years.push(year);
    }

    return years;
}

export default retrieveYearRange;