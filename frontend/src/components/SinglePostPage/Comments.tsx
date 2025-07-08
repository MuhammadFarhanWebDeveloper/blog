import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import Comment from "./Comment";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, type FormEvent, type Key } from "react";
import { toast } from "react-toastify";

const fetchComments = async (postId: string) => {
  const res = await api.get(`/comments/${postId}`);
  return res.data;
};

type Comment = {
  _id: string;
  desc: string;
  user: { username: string; img: string | undefined };
  createdAt: string;
};

export default function Comments({ postId }: { postId: string }) {
  const [comment, setComment] = useState("");
  const { isLoaded, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    data = [],
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async ({ desc }: { desc: string }) => {
      const token = await getToken();
      return api.post(
        `/comments/${postId}`,
        { desc },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {},
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!comment || !comment.trim()) {
      return;
    }
    mutation.mutate({ desc: comment });

    setComment("");
  };



  return (
    <div className="flex flex-col gap-8">
      <h1 className="underline font-semibold text-lg text-gray-600">
        Comments
      </h1>

      {/* Comment Form */}

      {!isLoaded ? (
        <div className="text-center mt-10 text-gray-600">Loading...</div>
      ) : !isSignedIn ? (
        <div className="text-center mt-10 text-red-500 font-semibold">
          You must be logged in!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex md:flex-row flex-col items-end gap-3"
        >
          <textarea
            className="w-full h-16 p-2 rounded-md outline-none bg-white "
            placeholder="Write Comment..."
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            disabled={!comment}
            className="p-2 rounded-md text-white bg-blue-700 font-semibold h-fit"
          >
            Send
          </button>
        </form>
      )}
      <div className="flex flex-col gap-4">
        {isPending ? (
          <div>Loading Comments...</div>
        ) : (
          data.map((comment: Comment) => {
            return (
              <Comment
                key={comment._id}
                comment={comment.desc}
                username={comment.user.username}
                img={comment.user.img}
                createdAt={comment.createdAt}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
