import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function WritePage() {
  const { isLoaded, isSignedIn } = useUser();

  const [coverImage, setCoverImage] = useState<null | string>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  if (!isLoaded) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        You must be logged in!
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📝 Create a New Post
      </h1>

     <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">Cover Image</label>

  <div className="flex items-start gap-4">
    {/* File Input */}
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        transition"
    />

    {/* Image Preview on the right */}
    {coverImage && (
      <div className="w-28 h-28 rounded-md overflow-hidden border border-gray-300 shadow">
        <img
          src={coverImage}
          alt="Cover Preview"
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
</div>


      <input
        type="text"
        placeholder="Post Title"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-4">
        <label htmlFor="cat" className="block text-gray-700 font-medium mb-2">
          Choose a Category
        </label>
        <select
          name="cat"
          id="cat"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="general">General</option>
          <option value="web-design">Web Design</option>
          <option value="development">Development</option>
          <option value="databases">Databases</option>
          <option value="search-engines">Search Engines</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <textarea
        name="desc"
        placeholder="Short Description"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <ReactQuill theme="snow" className="custom-editor" />

      <button className="bg-blue-600 my-4 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300">
        Submit
      </button>
    </div>
  );
}
