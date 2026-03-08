import capEach from "./capEach";
import splitCamelCase from "./splitCamelCase";
import getCategoryLabel from "./getCategoryLabel";
import { departments } from "@data";
import { formatDateTime } from "@utils";

const readObjectValueByPath = (obj, path) => {

  return path.split('.').reduce((acc, part) => {
    const value = acc?.[part];

    if (["status", "type"].includes(part)) {
      return splitCamelCase(value);
    }

    if (part == "category") {
      return getCategoryLabel(value);
    }

    if (part == "department") {
      return departments?.find(d => d.abbreviation == value)?.name ?? '-';
    }
    if (part == "fyp") {
      return { fyp1: "FYP 01", fyp2: "FYP 02", fyp3: "FYP 02", fypFinal: "FYP Final" }[value] ?? "-";
    }

    if (["schedule", "createdAt"].includes(part)) {
      return formatDateTime(value, true) ?? "-";
    }

    // if (part == "link") {
    //   const isExpired = dateSatus(part) != "Expired";
    //   return isExpired ? value : "The meeting link was expired";
    // }

    if (part == "email") {
      return value;
    }

    return capEach(value);
  }, obj);
};

export default readObjectValueByPath;
