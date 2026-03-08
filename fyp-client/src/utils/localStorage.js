const readLocalStorage = (key, isParseable = false) => {
    try {
        const data = localStorage.getItem(key);
        return isParseable ? JSON.parse(data) : data;
    } catch {
        return null;
    }
};

const writeLocalStorage = (key, data, stringifiable = false) => {
    try {
        if (stringifiable && typeof data !== 'object') {
            throw new Error('Data must be an object to be stringified');
        }
        const saveableData = stringifiable ? JSON.stringify(data) : data;
        localStorage.setItem(key, saveableData);
    } catch (error) {
        console.log(`Error saving to local storage: ${error.message}`);
    }
};

const deleteLocalStorage = (...keys) => {
    try {
        keys.forEach((key) => {
            if (typeof key !== 'string' || key.trim() === '') {
                throw new Error('Invalid key');
            }
            localStorage.removeItem(key);
        });
    } catch (error) {
        console.log(`Error removing from local storage: ${error.message}`);
    }
};

export { readLocalStorage, writeLocalStorage, deleteLocalStorage }
