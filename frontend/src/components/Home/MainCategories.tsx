import SearchBar from "../Shared/SearchBar";

const categories = ["Web Dev", "Design", "AI", "DevOps", "Marketing"];

export default function MainCategories() {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg justify-between items-center gap-6 max-w-6xl mx-auto">
      
      {/* Category Links */}
      <div className="flex-1 flex items-center gap-4 flex-wrap">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition text-sm font-medium"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar />

    </div>
  );
}
