import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { FiClock, FiTag, FiTrash, FiUser } from "react-icons/fi";
import { Link } from "react-router";
import api from "../../services/api";
import { toast } from "react-toastify";
import { FaEye, FaSpinner } from "react-icons/fa";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return api.delete(`/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post has been deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate();
  };

  return (
    <Link
      to={`/${post.slug}`}
      key={post._id}
      className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 my-5"
    >
      {post.img && (
        <img
          src={post.img}
          alt={post.title}
          width="400"
          height="300"
          className="w-full md:w-1/3 h-64 object-cover"
        />
      )}
      <div className="p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4">{post.desc}</p>

        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mt-auto">
          <span className="flex items-center gap-1  font-medium">
            <FaEye />
            <span>{post.visit}</span>
          </span>

          <div className="flex items-center gap-1">
          

            <FiUser className="text-gray-600" />
            <span className="font-semibold text-gray-700 truncate max-w-[120px] inline-block">
              {post.user.username}
            </span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-indigo-600 font-medium">
            <FiTag />
            <span>{post.category}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <FiClock />
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
          {post.user.clerkId === user?.id && (
            <>
              <div className="flex items-center gap-2 bg-indigo-100  text-xs font-semibold px-2.5 py-0.5 rounded-full ml-auto">
                <span>My Post</span>
              </div>
              <button
                onClick={handleClick}
                disabled={mutation.isPending}
                className="text-red-600 hover:bg-gray-400 rounded-full p-3  transition-colors"
                title="Delete this post"
              >
                {!mutation.isPending ? (
                  <FiTrash size={15} />
                ) : (
                  <FaSpinner size={15} className="animate-spin " />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
