import toast from 'react-hot-toast';

export const showSuccessToast = (message) => {
    toast.success(message, {
        duration: 2000,
        position: 'top-right',
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        duration: 3000,
        position: 'top-right',
    });
};

export const showLoadingToast = (message) => {
    return toast.loading(message, {
        position: 'top-right',
    });
};