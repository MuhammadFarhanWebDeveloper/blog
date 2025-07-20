import React, { useState, type FormEvent } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../services/api";
import { Categories } from "../constants/Categories";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/react";

export default function WritePage() {
  const [contentValue, setContentValue] = useState("");
  const [coverImage, setCoverImage] = useState<null | string>(null);
  const [file, setFile] = useState<null | File>(null);

  const [isPending, setIsPending] = useState(false);

  const authenticator = async () => {
    try {
      const response = await api.get("/posts/upload-auth");

      const { signature, expire, token, publicKey } = response.data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        throw new Error(`Axios request failed: ${error.message}`);
      }
      console.error("Unexpected error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async (file: File) => {
    const abortController = new AbortController();

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,

        abortSignal: abortController.signal,
      });
      return uploadResponse;
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    }
  };

  const navigate = useNavigate();
  const { getToken } = useAuth();
  type PostData = {
    title: string;
    desc: string;
    category: string | null;
    content: string;
  };

  const mutation = useMutation({
    mutationFn: async (newTodo: PostData) => {
      const token = await getToken();
      return api.post("/posts", newTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },

    onSuccess: (res) => {
      toast.success("Post has been created successfully");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong!");
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Unsupported file type. Please upload a JPEG, PNG, or WEBP.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB allowed.");
      return;
    }

    setCoverImage(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      if (!file) {
        toast.error("Please Select a file");
        return;
      }
      if (!formData.get("title") || !formData.get("desc")) {
        toast.error("Please fill out all required fields.");
        return;
      }
      setIsPending(true);
      const uploadResponse = await handleUpload(file);
      const image = uploadResponse?.url;

      const data = {
        title: formData.get("title") as string,
        desc: formData.get("desc") as string,
        category: formData.get("category") as string,
        img: image,
        content: contentValue,
      };

      mutation.mutate(data);
    } catch (error) {
    } finally {
      setIsPending(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create a New Post
      </h1>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Cover Image
        </label>

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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="title"
        />
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-medium mb-2"
          >
            Choose a Category
          </label>
          <select
            name="category"
            id="category"
            defaultValue={"general"}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Categories.map((category) => {
              return (
                <option value={category} key={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
        <textarea
          name="desc"
          placeholder="Short Description"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div className="flex">
      
          <ReactQuill
            theme="snow"
            value={contentValue}
            modules={modules}
            onChange={setContentValue}
            className="flex-1 custom-editor"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`relative flex items-center gap-2 my-3 px-4 py-2 rounded-md font-medium transition-all
    ${
      isPending
        ? "bg-blue-500 cursor-not-allowed opacity-70"
        : "bg-blue-700 hover:bg-blue-800 cursor-pointer"
    } text-white`}
        >
          {isPending && <FaSpinner className="animate-spin h-4 w-4" />}
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
