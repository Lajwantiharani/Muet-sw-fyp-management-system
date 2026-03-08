import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Overlay, Select, TextArea } from "@components";
import { ReviewPresentationSchema } from "@schemas";
import { useSelector } from "react-redux";

const ReviewPresentation = ({ closeForm, handleReview }) => {
    const { loading } = useSelector((state) => state.presentations);

    return (
        <Overlay
            title="Review Presentation"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
            zIndex="z-50"
            onClose={() => closeForm(true)}
        >
            <div className="flex">
                <Form onSubmit={handleReview} resolver={zodResolver(ReviewPresentationSchema)}>
                    <Select
                        name="status"
                        label="Review Decision"
                        placeholder="Please choose a review decision"
                        options={[
                            { value: "approved", label: "Approve" },
                            { value: "rejected", label: "Reject" },
                        ]}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                        <TextArea
                            name="remarks"
                            label="Remarks"
                            placeholder="Remarks must be between (5-350 words)"
                            rows={10}
                        />
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full mt-3 text-sm">Proceed</Button>
                </Form>
            </div>
        </Overlay>
    )
};

export default ReviewPresentation;
