import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { FaSave } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function PostMenuActions({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <div className="flex gap-2 flex-col ">
      <h1 className="font-semibold">Actions</h1>
      {!isLoaded ? (
        "Loading"
      ) : !isSignedIn ? (
        ""
      ) : (
        <ul>
          <li className="flex gap-3 items-center my-3">
            <FaSave size={18} />
            <div>Save Post</div>
          </li>
          {user.id == userId && (
            <li className="">
              <button
                onClick={handleClick}
                disabled={mutation.isPending}
                className="text-red-600 flex gap-3 items-center my-3"
              >
                <RiDeleteBin6Line size={18} />
                <div>Delete Post</div>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
