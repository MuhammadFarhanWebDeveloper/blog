import SideMenu from "../components/PostsPage/SideMenu";
import PostList from "../components/Shared/PostList";

export default function PostListPage() {
  return (
    <div>
      <h1 className="text-2xl my-5 font-bold">Development Blogs</h1>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="w-3/4">
          <PostList />
        </div>

        {/* Side Menu */}
        <SideMenu />
      </div>
    </div>
  );
}
