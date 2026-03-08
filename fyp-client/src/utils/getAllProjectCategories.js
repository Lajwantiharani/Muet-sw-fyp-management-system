import { projectCategories } from "@data";

const getAllProjectCategories = () => {
  return projectCategories ?? [];
}

export default getAllProjectCategories;