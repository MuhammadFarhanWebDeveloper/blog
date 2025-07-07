import { Link } from "react-router";

interface Post {
  imgSrc: string;
  alt?: string;
  category: string;
  categoryLink: string;
  timeAgo: string;
  title: string;
  link: string;
}

interface FeaturedPostsProps {
  posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null;

  const [mainPost, ...sidePosts] = posts;

  return (
    <section className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* Left side — main featured post */}
      <div className="lg:w-2/3 w-full">
        <Link to={mainPost.link}>
          <div className="overflow-hidden rounded-3xl transform transition-transform duration-300 hover:scale-105">
            <img
              src={mainPost.imgSrc}
              alt={mainPost.alt || "Featured Post"}
              className="w-full h-80 object-cover"
            />
          </div>
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <h2 className="font-semibold text-lg">
            01.
          </h2>
          <Link
            to={mainPost.categoryLink}
            className="text-blue-800 text-lg hover:underline"
          >
            {mainPost.category}
          </Link>
          <span className="text-gray-500">{mainPost.timeAgo}</span>
        </div>
        <Link to={mainPost.link}>
          <h3 className="text-xl font-semibold hover:text-blue-800 transition-colors mt-2">
            {mainPost.title}
          </h3>
        </Link>
      </div>

      {/* Right side — stacked smaller posts */}
      <div className="lg:w-1/3 w-full flex flex-col gap-6">
        {sidePosts.map((post, i) => (
          <div key={i} className="flex flex-col  p-4 rounded-xl group transition-shadow hover:shadow-md">
            <Link to={post.link}>
              <div className="overflow-hidden rounded-xl  mb-2">
                <img
                  src={post.imgSrc}
                  alt={post.alt || "Post"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="flex items-center gap-4 text-sm mb-1">
              <h2 className="font-semibold text-base">
                {String(i + 2).padStart(2, "0")}.
              </h2>
              <Link
                to={post.categoryLink}
                className="text-blue-700 hover:underline"
              >
                {post.category}
              </Link>
              <span className="text-gray-500">{post.timeAgo}</span>
            </div>
            <Link to={post.link}>
              <h3 className="text-base font-semibold hover:text-blue-700 transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
