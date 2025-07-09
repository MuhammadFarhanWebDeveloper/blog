import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useSearchParams } from "react-router";
import { FaSpinner } from "react-icons/fa";
import PostCard from "./PostCard";
import { useUser } from "@clerk/clerk-react";

const fetchPosts = async ({
  pageParam = 1,
  category,
  search,
  sortBy,
  clerkId,
}: {
  pageParam: number;
  category: string | null;
  search: string | null;
  sortBy: string | null;
  clerkId?: string | undefined;
}): Promise<PaginatedPosts> => {
  const res = await api.get("/posts", {
    params: {
      page: pageParam,
      category,
      limit: 3,
      search,
      sort: sortBy,
      clerkId,
    },
  });
  return res.data;
};

export default function PostList() {
  const [searchParams] = useSearchParams();
  const { user, isLoaded, isSignedIn } = useUser();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sort");
  const location = useLocation();

  const clerkId = location.pathname == "/my-posts" ? user?.id : undefined;
  console.log(location.pathname);

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    queryKey: ["posts", category, search, sortBy, clerkId],
    queryFn: ({ pageParam }) =>
      fetchPosts({ pageParam, category, search, sortBy, clerkId }),
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
          <PostCard post={post} key={post._id} />
        ))}
      </InfiniteScroll>
    </div>
  );
}
