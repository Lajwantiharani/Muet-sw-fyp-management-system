import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Overlay, Select, TextArea } from "@components";
import { createPresentationSchema } from "@schemas";
import { useDispatch } from "react-redux";
import { createPresentation } from "@features";
import { useEffect, useState } from "react";

const CreatePresentationForm = ({ lastPresentation, projectId, closeForm, isLoading }) => {
    const dispatch = useDispatch();
    const [options, setOptions] = useState([{ value: 'fyp1', label: 'FYP 01' }]);

    const onSubmit = async (data) => {
        data.append("project", projectId);
        const result = await dispatch(createPresentation(data));
        if (createPresentation.fulfilled.match(result)) closeForm(true);
    };

    useEffect(() => {
        const fyp = lastPresentation?.fyp?.toLowerCase();
        const approved = lastPresentation?.status?.toLowerCase() == 'approved';

        const base = {
            fyp1: [{ value: 'fyp1', label: 'FYP 01' }],
            fyp2: [{ value: 'fyp2', label: 'FYP 02' }],
            fypfinal: [{ value: 'fypFinal', label: 'FYP Final' }]
        };

        const extended = {
            fyp1: [{ value: 'fyp2', label: 'FYP 02' }],
            fyp2: [{ value: 'fypFinal', label: 'FYP Final' }]
        };

        const result = approved ? extended[fyp] || base.fyp1 : base[fyp] || base.fyp1;
        setOptions(result);
    }, [lastPresentation]);

    return (
        <Overlay
            dasboardSpecific
            onClose={() => closeForm(true)}
            title="New Presentation"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
        >
            <Form onSubmit={onSubmit} resolver={zodResolver(createPresentationSchema)} encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                    <Select
                        name="fyp"
                        label="Phase"
                        placeholder="Select your presentation phase"
                        options={options}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                    <TextArea
                        name="summary"
                        label="Presentation Summary"
                        placeholder="Enter a brief summary of the presentation"
                        rows={10}
                    />
                </div>

                <div className="grid grid-cols-1 lg:gap-4">
                    <Input
                        type="file"
                        name="resource"
                        label="Presentation File"
                        placeholder="Select your presentation file"
                        accept=".pdf, .pptx, .docx, .zip, .rar, .7z, .tar"
                    />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full mt-4">
                    Submit Presentation
                </Button>
            </Form>
        </Overlay >
    );
};

export default CreatePresentationForm;
