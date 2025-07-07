import { FaSave } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function PostMenuActions() {
  return (
    <div className="flex gap-2 flex-col ">
      <h1 className="font-semibold">Actions</h1>
      <ul>
        <li className="flex gap-3 items-center my-3">
          <FaSave size={18} />
          <div>Save Post</div>
        </li>
        <li className="text-red-600 flex gap-3 items-center my-3">
          <RiDeleteBin6Line size={18} />
          <div>Delete Post</div>
        </li>
      </ul>
    </div>
  );
}
