const splitCamelCase = (camelCaseString) => {
    if (!camelCaseString) return "";

    return camelCaseString
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default splitCamelCase;