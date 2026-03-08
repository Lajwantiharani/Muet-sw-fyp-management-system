import { Button, Overlay, closeModal } from '@components';
import { cropImage, showErrorToast } from '@utils';
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ onCrop, image, onClose, buttonText = "Crop", moodalTitle = "Adjust an Image", isLoading = false }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    React.useEffect(() => {
        if (!image) return;
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result);
        reader.readAsDataURL(image);
    }, [image]);

    const onCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImageUrl = await cropImage(imageSrc, croppedAreaPixels);
            onCrop(croppedImageUrl);
        } catch (e) {
            showErrorToast(e.message);
        }
    };

    const handleModalClose = () => {
        onClose(); closeModal();
    }

    return (
        <Overlay title={moodalTitle} onClose={handleModalClose} dismisible={false}>
            <div className="relative h-96 bg-primary">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <Button isLoading={isLoading} onClick={handleCrop} className="w-full mt-2 text-sm">{buttonText}</Button>
        </Overlay>
    );
};

export default ImageCropper;
