import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useNavigate } from "react-router";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);

  const { data = { posts: [] }, isLoading } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      const res = await api.get(`/posts`, {
        params: {
          search: debouncedQuery,
        },
      });
      return res.data;
    },
    enabled: !!debouncedQuery,
  });

  const onSelect = (title: string) => {
    setQuery(title); // update input with selected post title
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/posts?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search articles..."
        className="w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        size={18}
      />

      {isLoading && (
        <div className="absolute mt-2 text-sm text-gray-500">Loading...</div>
      )}

      {data.posts?.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-md max-h-60 overflow-y-auto">
          {data.posts.map((post: any) => (
            <li
              key={post._id}
              className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer"
              onClick={() => onSelect(post.title)}
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
