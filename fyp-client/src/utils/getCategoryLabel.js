import { projectCategories } from "@data";
import capEach from './capEach';

const getCategoryLabel = (category) => {
    const cat = projectCategories.find(cat => cat.value == category);
    return cat ? cat?.label : capEach(category);
}

export default getCategoryLabel;