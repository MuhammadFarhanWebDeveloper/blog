import { Link, useSearchParams } from "react-router";
import SearchBar from "../Shared/SearchBar";
import { Categories } from "../../constants/Categories";
import { useEffect } from "react";

export default function SideMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  // On mount, set default sort if not already present
  useEffect(() => {
    if (!searchParams.get("sort")) {
      searchParams.set("sort", "newest");
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const handleSortChange = (sortValue: string) => {
    searchParams.set("sort", sortValue.toLowerCase());
    setSearchParams(searchParams);
  };

  return (
    <div className="w-1/4 sticky top-8 h-max">
      <div className="p-4 flex flex-col gap-6 rounded-md">
        {/* Search */}
        <SearchBar />

        {/* Filters */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg">Filters</h2>
          <ul className="flex flex-col gap-2">
            {["Newest", "Oldest", "Most Popular"].map((label) => {
              const value = label.toLowerCase();
              return (
                <li key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={label}
                    name="sort"
                    checked={currentSort === value}
                    onChange={() => handleSortChange(value)}
                  />
                  <label htmlFor={label} className="cursor-pointer">
                    {label}
                  </label>
                </li>
              );
            })}
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
