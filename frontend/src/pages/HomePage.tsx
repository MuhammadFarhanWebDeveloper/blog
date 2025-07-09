import MainCategories from "../components/Home/MainCategories";
import PostList from "../components/Shared/PostList";



export default function HomePage() {
  return (
    <div className="pb-32">
      {/* Introduction */}
      <section className="my-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight mb-6">
              Welcome to the FarhanBlog{" "}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover articles, tutorials, and thoughts on web development,
              tech trends, and more.
            </p>
          </div>

          {/* Image */}
          <div className="lg:block hidden w-1/2 ">
            <img
              src="/blog-intro.png"
              alt="Blog illustration"
              width={200}
              height={200}
              className="w-full max-w-md mx-auto rounded-md "
            />
          </div>
        </div>
      </section>
      {/* Categories */}
      <MainCategories />

      {/* Featured Posts */}
      {/* <FeaturedPosts posts={posts} /> */}


      {/* Recent Posts */}
      <div>
        <h1 className="my-8 text-2xl font-black">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
}
