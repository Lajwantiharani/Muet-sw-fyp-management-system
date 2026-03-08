import { DashboardContent, ImageCropper, ProfileForm, UpdatePasswordForm } from "@components";
import { updateProfile, updateAuthenticatedUser } from "@features";
import { capEach, firstLetter, formatFilePath } from "@utils";
import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const ProfileSettings = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);
    const fileRef = useRef();
    const [cropImageFile, setCropImageFile] = useState(null);

    const handleCropped = async (base64Image) => {
        const blob = await (await fetch(base64Image)).blob();
        const formData = new FormData();
        formData.append("image", blob, "cropped.png");

        const result = await dispatch(updateProfile(formData));
        if (updateProfile.fulfilled.match(result)) {
            dispatch(updateAuthenticatedUser(result.payload.user));
            setCropImageFile(null);
        }
    };

    return (
        <DashboardContent title="Profile Settings" description="Manage your profile settings and changes">
            {cropImageFile && (
                <ImageCropper
                    moodalTitle="Adjust and Upload Profile Picture"
                    buttonText="Upload"
                    image={cropImageFile}
                    onCrop={handleCropped}
                    onClose={() => setCropImageFile(null)}
                    isLoading={loading}
                />
            )}

            <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                hidden
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setCropImageFile(file);
                    e.target.value = ""
                }}
            />

            <div className="flex justify-between items-center gap-6 p-2 mb-2">
                <h4 className="font-black text-theme text-lg sm:text-xl m-0">Profile Settings</h4>
            </div>

            <div className="relative bg-primary border border-primary rounded-lg overflow-hidden mb-4 shadow-sm">
                <div className="h-24 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="flex items-center gap-4 px-6  -mt-12 sm:-mt-14 mb-8">
                    <div className="relative w-24 sm:w-28 h-24 sm:h-28 focus:outline-none">
                        <div className="w-full h-full rounded-full overflow-hidden border border-primary bg-secondary">
                            {user?.image ? (
                                <img
                                    src={formatFilePath(user.image)}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-secondary">
                                    {firstLetter(user?.name)}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-white shadow p-[6px] rounded-full hover:!bg-gray-100 transition"
                            title="Change picture"
                        >
                            <FaCamera className="text-gray-700 text-[14px]" />
                        </button>
                    </div>
                    <div className="flex-1 mt-4">
                        <h2 className="text-lg font-semibold text-white">{capEach(user?.name)}</h2>
                        <p className="text-sm text-secondary">{user?.email}</p>
                        <p className="text-sm text-secondary">({user?.role})</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 shadow-sm">
                    <ProfileForm />
                </div>
                <div className="lg:col-span-4 shadow-sm">
                    <UpdatePasswordForm />
                </div>
            </div>
        </DashboardContent>
    );
};

export default ProfileSettings;
