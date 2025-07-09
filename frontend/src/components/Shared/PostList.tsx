import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatDistanceToNow } from "date-fns";
import { Link, useSearchParams } from "react-router";
import { FaSpinner } from "react-icons/fa";

const fetchPosts = async ({
  pageParam = 1,
  category,
  search,
  sortBy,
}: {
  pageParam: number;
  category: string | null;
  search: string | null;
  sortBy: string | null;
}): Promise<PaginatedPosts> => {
  const res = await api.get("/posts", {
    params: {
      page: pageParam,
      category,
      limit: 3,
      search,
      sort: sortBy,
    },
  });
  return res.data;
};

export default function PostList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sort");
  console.log(sortBy);

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    queryKey: ["posts", category, search, sortBy],
    queryFn: ({ pageParam }) =>
      fetchPosts({ pageParam, category, search, sortBy }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
        <span className="ml-3 text-indigo-600 font-medium">
          Loading posts...
        </span>
      </div>
    );
  }
  console.log(data);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
  if (allPosts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-lg font-semibold">No posts found.</p>
        <p className="text-sm">Try a different category or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
            <span className="ml-3 text-indigo-600 font-medium">
              Loading more posts...
            </span>
          </div>
        }
        endMessage={
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">You've reached the end!</p>
            <p className="text-xs">No more posts to show. Check back later.</p>
          </div>
        }
      >
        {allPosts.map((post) => (
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
      </InfiniteScroll>
    </div>
  );
}
