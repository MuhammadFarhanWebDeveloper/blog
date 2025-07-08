import { FaFacebook, FaInstagram } from "react-icons/fa";
import { Link, useParams } from "react-router";
import PostMenuActions from "../components/SinglePostPage/PostMenuActions";
import SearchBar from "../components/Shared/SearchBar";
import Comments from "../components/SinglePostPage/Comments";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";

const fetchPost = async (slug: string) => {
  const res = await api.get(`/posts/${slug}`);
  return res.data;
};

export default function SinglePostPage() {
  const { slug } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug!),
  });

  if (isPending) {
    return <div>Loading</div>;
  }
  console.log(data);

  return (
    <div className="flex  pb-24 flex-col  gap-8">
      {/* detail */}

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 px-4 py-8">
        {/* Text Section */}
        <div className="lg:w-1/2 w-full">
          <h1 className="text-2xl lg:text-3xl font-bold">{data.title} </h1>
          <div className="my-4 text-gray-500 text-sm">
            Written by{" "}
            <span className="font-medium text-gray-700">
              {data.user.username}
            </span>
            , on{" "}
            <span className="text-indigo-600 font-medium">{data.category}</span>{" "}
            • {formatDistanceToNow(data.createdAt)}
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
                <Link to={""} className="text-blue-800 max-w-[156px] truncate block  font-semibold">
                  {data.user.username}
                </Link>
              </div>
              <p className="text-sm ">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo
                nesciunt voluptatum hic?
              </p>
            </div>
            {/* social links */}
            <div className="flex gap-4 items-center">
              <FaFacebook size={25} />
              <FaInstagram size={25} />
            </div>
          </div>
          {/* Actions */}
          <PostMenuActions />

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
