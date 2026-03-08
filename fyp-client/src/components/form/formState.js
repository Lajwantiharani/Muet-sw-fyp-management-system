let resetForm = () => {};
let setValue = () => {};

const registerFormHelpers = (methods) => {
    resetForm = () => methods.reset();
    setValue = (field, value, options) => methods.setValue(field, value, options);
};

export { resetForm, setValue, registerFormHelpers };
