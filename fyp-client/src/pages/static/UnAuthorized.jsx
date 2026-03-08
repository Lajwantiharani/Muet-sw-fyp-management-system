import { Button } from "@components";
import { FaArrowLeft } from "react-icons/fa";

const Unauthorized = () => {
    return (
        <div className="flex flex-col justify-center text-center min-h-screen">
            <h1>403 | Unauthorized</h1>
            <p className="-mt-4 mb-4">You do not have permission to access this page.</p>
            <Button className="self-center flex justify-center items-center gap-1 hover:no-underline" href={-1}>
                <FaArrowLeft /> Go back
            </Button>
        </div>
    );
};

export default Unauthorized;
