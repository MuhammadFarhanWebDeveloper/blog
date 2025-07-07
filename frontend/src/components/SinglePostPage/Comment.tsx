import { Link } from "react-router";

export default function Comment() {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
      <div className="flex items-center  gap-5">
        <img src="/noavatar.png" className="w-9 h-9 rounded-full" width={64} height={64} alt="User Avatar" />

        <Link to={""} className="text-blue-800">Farhan</Link>

        <div className="text-gray-600">2days ago</div>
      </div>

      <div className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
        aliquam vel repellendus magnam velit tenetur expedita unde corrupti
        facilis perferendis!
      </div>
    </div>
  );
}
