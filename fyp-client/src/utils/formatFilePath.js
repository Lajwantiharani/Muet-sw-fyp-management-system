import { API_BASE_URL } from "@config";

const formatFilePath = (filePath) => {
    return API_BASE_URL + "/uploads/" + filePath;;
}

export default formatFilePath;