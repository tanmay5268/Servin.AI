import React from "react";
import { Hash, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const BlogTitles = () => {
  const blogCategories = [
    "Technology",
    "Health",
    "Finance",
    "Travel",
    "Food",
    "Lifestyle",
    "Business",
    "General",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("General");
  const [input, setInput] = React.useState("");

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = input + " in the category of " + selectedCategory;
      const { data } = await axios.post(
        "api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error("Failed to generate titles. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while generating the titles.");
      console.error("Title generation error:", error);
    }
    // TODO: wire generation
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Form Section */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <label className="mt-6 block text-sm font-medium">Article Topic</label>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <label className="mt-4 block text-sm font-medium">Category</label>
        <div className="flex mt-3 gap-3 flex-wrap">
          {blogCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedCategory(item)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer focus:outline-none ${
                selectedCategory === item
                  ? "border-2 border-purple-600 text-purple-600 font-medium bg-white shadow-sm"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-full"
        >
          {loading ? "Generating..." : "Generate Title"}
          <Hash className="w-5" />
        </button>
      </form>

      {/* Results placeholder */}
      <div className="flex-1 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[220px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-8 h-8 text-gray-300" />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>
          </div>
        ) : (
          <div className="reset-tw">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
