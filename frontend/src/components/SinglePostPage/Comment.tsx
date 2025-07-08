import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";

export default function Comment({
  comment,
  username,
  img,
  createdAt,
}: {
  comment: string;
  username: string;
  img?: string;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg p-4">
      <div className="flex items-center  gap-5">
        <img
          src={img || "/noavatar.png"}
          className="w-9 h-9 rounded-full"
          width={64}
          height={64}
          alt="User Avatar"
        />

        <Link
          to={""}
          className="text-blue-800 max-w-[150px] truncate block"
          title={username} // shows full name on hover
        >
          {username}
        </Link>

        <div className="text-gray-600">{formatDistanceToNow(createdAt)}</div>
      </div>

      <div className="text-sm">{comment}</div>
    </div>
  );
}
