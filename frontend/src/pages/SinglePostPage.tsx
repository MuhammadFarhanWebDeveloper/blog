import { Link, useLoaderData } from "react-router";
import PostMenuActions from "../components/SinglePostPage/PostMenuActions";
import SearchBar from "../components/Shared/SearchBar";
import Comments from "../components/SinglePostPage/Comments";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { FiClock, FiTag, FiUser } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

export default function SinglePostPage() {
  const data: Post = useLoaderData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex  pb-24 flex-col  gap-8">
      {/* detail */}

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 px-4 py-8">
        {/* Text Section */}
        <div className="lg:w-1/2 w-full">
          <h1 className="text-2xl lg:text-3xl my-5 font-bold">{data.title} </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mt-auto">
            <span className="flex items-center gap-1  font-medium">
              <FaEye />
              <span>{data.visit}</span>
            </span>{" "}
            <div className="flex items-center  gap-1">
              <FiUser className="text-gray-600" />
              <span className="font-semibold text-gray-700 truncate max-w-[120px] inline-block">
                {data.user.username}
              </span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1 text-indigo-600 font-medium">
              <FiTag />
              <span>{data.category}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <FiClock />
              <span>{formatDistanceToNow(new Date(data.createdAt))} ago</span>
            </div>
          </div>
          <p className="text-gray-700">{data.desc}</p>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 w-full flex justify-center">
          {data.img && (
            <img
              className="rounded-md w-full max-w-[500px] h-auto"
              src={data.img}
              alt="Article visual"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-6">
        {/* content */}
        <div className="w-full">
          <div className="flex my-8  w-full  flex-col gap-6 lg:text-lg text-justify ">
            <h1 className="font-bold text-2xl">Content:</h1>
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>

          {/* Comments */}
          <Comments postId={data._id} />
        </div>

        {/* menu */}
        <div className="flex py-8 w-1/3  flex-col gap-8 ">
          {/* Author */}
          <div className="flex gap-2 flex-col ">
            <h1 className="font-semibold">Author</h1>
            <div>
              <div className="flex my-3 gap-4 items-center ">
                <img
                  src="/noavatar.png"
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <Link
                  to={""}
                  className="text-blue-800 max-w-[156px] truncate block  font-semibold"
                >
                  {data.user.username}
                </Link>
              </div>
            </div>
            {/* social links */}
          </div>
          {/* Actions */}
          <PostMenuActions postId={data._id} userId={data.user.clerkId!} />

          {/* Categories */}

          <div className="flex gap-2 flex-col ">
            <h1 className="font-semibold">Categories</h1>

            <ul className="flex flex-col justify-center gap-3">
              <li className="underline text-blue-800">
                <Link to={""}>All</Link>
              </li>
              <li className="underline text-blue-800">
                <Link to={""}>Web Design</Link>
              </li>{" "}
              <li className="underline text-blue-800">
                <Link to={""}>Development</Link>
              </li>{" "}
              <li className="underline text-blue-800">
                <Link to={""}>Databases</Link>
              </li>{" "}
              <li className="underline text-blue-800">
                <Link to={""}>Search Engines</Link>
              </li>{" "}
              <li className="underline text-blue-800">
                <Link to={""}>Marketing</Link>
              </li>
            </ul>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
