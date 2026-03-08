const firstAndLastInitial = (...words) => {
    const fullName = words
        .filter(word => typeof word == 'string' && word.trim().length > 0)
        .join(' ')
        .trim();

    if (!fullName) return '';

    const parts = fullName.split(/\s+/);
    const first = parts[0]?.charAt(0).toUpperCase() || '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';

    return first + last;
};

export default firstAndLastInitial;
