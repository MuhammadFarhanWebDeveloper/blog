"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

// Mock API service - replace with your actual API
const api = {
  get: async (url: string, config?: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const searchTerm = config?.params?.search?.toLowerCase() || ""

    // Mock data
    const mockPosts = [
      { _id: "1", title: "Getting Started with React Hooks", category: "React" },
      { _id: "2", title: "Advanced TypeScript Patterns", category: "TypeScript" },
      { _id: "3", title: "Building Responsive Layouts with CSS Grid", category: "CSS" },
      { _id: "4", title: "Next.js App Router Deep Dive", category: "Next.js" },
      { _id: "5", title: "State Management with Zustand", category: "React" },
      { _id: "6", title: "Optimizing React Performance", category: "React" },
      { _id: "7", title: "Modern CSS Techniques", category: "CSS" },
      { _id: "8", title: "TypeScript Best Practices", category: "TypeScript" },
    ]

    const filteredPosts = mockPosts.filter((post) => post.title.toLowerCase().includes(searchTerm))

    return { data: { posts: filteredPosts } }
  },
}

interface Post {
  _id: string
  title: string
  category: string
}

export default function ImprovedSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [debouncedQuery] = useDebounce(query, 300)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const {
    data = { posts: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      const res = await api.get(`/posts`, {
        params: {
          search: debouncedQuery,
        },
      })
      return res.data
    },
    enabled: !!debouncedQuery && debouncedQuery.length > 1,
  })

  const posts: Post[] = data.posts || []
  const showSuggestions = isOpen && (posts.length > 0 || isLoading || (query.length > 1 && !isLoading))
  const showRecentSearches = isOpen && query.length === 0 && recentSearches.length > 0

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true)
        return
      }
      return
    }

    const totalItems = showRecentSearches ? recentSearches.length : posts.length

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (showRecentSearches) {
            handleSelect(recentSearches[selectedIndex])
          } else if (posts[selectedIndex]) {
            handleSelect(posts[selectedIndex].title)
          }
        } else {
          handleSubmit(e)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle selection
  const handleSelect = (title: string) => {
    setQuery(title)
    setIsOpen(false)
    setSelectedIndex(-1)

    // Add to recent searches
    const updated = [title, ...recentSearches.filter((s) => s !== title)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    // Navigate to search results
    router.push(`/posts?search=${encodeURIComponent(title)}`)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSelect(query.trim())
    }
  }

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true)
  }

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Clear search
  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Remove recent search
  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter((s) => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles..."
            className="w-full py-3 pl-10 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
              if (e.target.value.length > 0) {
                setIsOpen(true)
              }
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {(showSuggestions || showRecentSearches) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <Clock size={14} />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={search}
                  className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                    selectedIndex === index ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelect(search)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    {search}
                  </span>
                  <button
                    onClick={(e) => removeRecentSearch(search, e)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={`Remove ${search} from recent searches`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {/* Error State */}
          {error && <div className="p-4 text-center text-sm text-red-500">Something went wrong. Please try again.</div>}

          {/* Search Results */}
          {!isLoading && posts.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <TrendingUp size={14} />
                Suggestions
              </div>
              {posts.map((post, index) => (
                <div
                  key={post._id}
                  className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${
                    selectedIndex === index ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelect(post.title)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="font-medium">{highlightMatch(post.title, debouncedQuery)}</div>
                  <div className="text-xs text-gray-500 mt-1">{post.category}</div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length > 1 && posts.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">No articles found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  )
}
