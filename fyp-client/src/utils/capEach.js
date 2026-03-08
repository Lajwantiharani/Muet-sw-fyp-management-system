import capitalize from "./capitalize";

const capEach = (str) => {
    if (typeof str != "string") return str;

    return str.split(' ').map(capitalize).join(' ');
}

export default capEach;