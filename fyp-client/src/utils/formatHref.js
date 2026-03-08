const formatHref = (value) => {
    if (!value) return ["#", "Not Provided"];

    const href = String(value).toLowerCase();

    const isEmail = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(href);
    if (isEmail) return [`mailto:${href}`, href];

    const isPhone = /^(\+92)?3[0-3,7]\d{8}$/.test(href);
    if (isPhone) {
        const formatted = href.startsWith("+92") ? href : `+92${href}`;
        return [`tel:${formatted}`, formatted];
    }

    const url = href.startsWith("https://") ? href : `https://${href}`;
    return [url, url];
};

export default formatHref;
