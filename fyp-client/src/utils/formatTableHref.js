import dateSatus from "./dateStatus";
import formatHref from "./formatHref";

const formatTableHref = (field, value, record = null) => {
    if (field == "link") {
        const status = dateSatus(record["schedule"] ?? null);
        if (status == "Expired") {
            return ["#", "Link was expired."];
        }
    }

    return formatHref(value);
}

export default formatTableHref;