import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

import { formatDistanceToNow } from "date-fns";
import { Link, useSearchParams } from "react-router";

const fetchPosts = async ({ category }: { category: string | null }) => {
  const res = await api.get("/posts", {
    params: {
      category,
    },
  });
  return res.data;
};

export default function PostList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const params = { category };
  const {
    isPending,
    error,
    data = [],
  } = useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div className="space-y-6">
      {data.map((post) => (
        <Link
          to={`/${post.slug}`}
          key={post._id}
          className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
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
            <div className="text-sm text-gray-500">
              Written by{" "}
              <span className="font-medium text-gray-700">
                {post.user.username}
              </span>
              , in{" "}
              <span className="text-indigo-600 font-medium">
                {post.category}
              </span>{" "}
              • {formatDistanceToNow(post.createdAt)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
