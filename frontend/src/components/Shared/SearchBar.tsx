import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router";

interface Post {
  _id: string;
  title: string;
}

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data = { posts: [] },
    isLoading,
    isError,
  } = useQuery<{ posts: Post[] }>({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return { posts: [] };
      const res = await api.get(`/posts`, {
        params: {
          search: debouncedQuery,
          limit: 5,
        },
      });
      return res.data;
    },
    enabled: !!debouncedQuery.trim(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSelect = (title: string) => {
    setQuery(title);
    setIsFocused(false);
    navigate(`/posts?search=${encodeURIComponent(title.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/posts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsFocused(false);
  };


  return (
    <div ref={searchRef} className="relative  max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full py-2 pl-10 pr-8 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-label="Search articles"
        />
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500  pointer-events-none"
          size={18}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  hover:text-gray-700 "
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </form>

      {isFocused && query.trim() && (
        <div className="absolute z-10 mt-2 w-full bg-white  rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          ) : isError ? (
            <div className="px-4 py-2 text-sm text-red-500">
              Failed to load suggestions
            </div>
          ) : data.posts.length > 0 ? (
            <ul>
              {data.posts.map((post) => (
                <li
                  key={post._id}
                  className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer border-b border-gray-100  last:border-b-0"
                  onClick={() => onSelect(post.title)}
                >
                  {post.title}
                </li>
              ))}
              <li
                className="px-4 py-2 text-sm font-medium text-indigo-600  hover:bg-indigo-100  cursor-pointer"
                onClick={() =>
                  handleSubmit({ preventDefault: () => {} } as React.FormEvent)
                }
              >
                See all results for "{query}"
              </li>
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 ">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
