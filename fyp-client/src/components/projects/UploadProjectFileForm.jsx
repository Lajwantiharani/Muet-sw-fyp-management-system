import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Overlay, Input } from "@components";
import { uploadProposalFileSchema } from "@schemas";
import { useSelector } from "react-redux";

const UploadProjectFileForm = ({ closeForm, handleAction }) => {
    const { loading } = useSelector((state) => state.projects);

    return (
        <Overlay
            title="Upload Proposal File"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
            zIndex="z-50"
            onClose={() => closeForm(true)}
        >
            <div className="flex">
                <Form onSubmit={handleAction} resolver={zodResolver(uploadProposalFileSchema)}>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                        <Input
                            type="file"
                            name="proposal"
                            label="Proposal File"
                            placeholder="Upload the project proposal file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full mt-3">Upload</Button>
                </Form>
            </div>
        </Overlay>
    )
};

export default UploadProjectFileForm;
