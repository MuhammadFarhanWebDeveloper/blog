import { Link } from "react-router";
import SearchBar from "../Shared/SearchBar";
import { Categories } from "../../constants/Categories";

export default function SideMenu() {
  return (
    <div className="w-1/4 sticky top-8 h-max">
      <div className="p-4 flex flex-col gap-6  rounded-md">
        {/* Search */}
        <SearchBar />

        {/* Filters */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Filters</h2>
          <ul className="flex flex-col gap-2">
            {["Newest", "Oldest", "Most Popular", "Trending"].map(
              (label, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input type="radio" id={label} name="sort" />
                  <label htmlFor={label} className="cursor-pointer">
                    {label}
                  </label>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Categories</h2>
          <ul className="flex flex-col gap-2 text-blue-800 underline">
            {Categories.map((category, index) => (
              <li key={index}>
                <Link to={`/posts?category=${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
