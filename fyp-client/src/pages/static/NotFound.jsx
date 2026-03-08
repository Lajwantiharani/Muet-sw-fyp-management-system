import { Button } from "@components";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (

    <div className="flex flex-col min-h-screen justify-center bg-primary text-center">
      <h1>404 | Page Not Found</h1>
      <p className="-mt-4 mb-4">The page you are looking for does not exist.</p>
      <Button className="self-center flex justify-center items-center gap-1 hover:no-underline" href={-1}>
        <FaArrowLeft /> Go back
      </Button>
    </div>

  )
};

export default NotFound;
