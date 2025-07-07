import { FiSearch } from 'react-icons/fi'

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full py-2 pl-10 pr-4 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
      </div>
  )
}
