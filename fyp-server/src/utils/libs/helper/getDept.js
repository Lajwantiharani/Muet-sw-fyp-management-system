const departments = [
    {
        "name": "Software Engineering",
        "abbreviation": "SW"
    },
    {
        "name": "Information Technology",
        "abbreviation": "IT"
    },
    {
        "name": "Computer Science",
        "abbreviation": "CS"
    }
];

const getDept = (abbr) => departments?.find(dept => dept.abbreviation == abbr)?.name ?? String(abbr);

export default getDept;