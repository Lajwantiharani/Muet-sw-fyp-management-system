import { apiRequest } from "@utils";

const readFile = async (filePath) => {
    const response = await apiRequest.get(`/files/${filePath}`, {
        responseType: "blob",
        showToast: false,
    });

    return URL.createObjectURL(response.data);
};

export default readFile;