import { Link } from "react-router";
import { Categories } from "../../constants/Categories";
import SearchBar from "../Shared/SearchBar";

export default function MainCategories() {
  return (
    <div className="flex bg-gray-100  rounded-3xl xl:rounded-full px-4 p-2 shadow-lg justify-between items-center gap-6 max-w-6xl mx-auto md:w-full w-fit">
      {/* Category Links */}
      <div className="flex-1 hidden md:flex items-center gap-4 flex-wrap">
        {Categories.map((cat, index) => (
          <Link
            to={`/posts?category=${cat}`}
            key={index}
            className="px-3 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-sm font-medium"
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar />
    </div>
  );
}
