import React from "react";
import { Edit, Sparkles } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from  "react-markdown";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 
const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write a detailed article on the topic "${input}" with a length of around ${selectedLength.text} words. Make sure the article is well-structured, informative, and engaging. Use subheadings, bullet points, and examples where appropriate to enhance readability. The article should provide value to the readers and cover various aspects of the topic comprehensively.`;
      const {data}  = await axios.post('api/ai/generate-article', {prompt,selectedLength: selectedLength.length},{
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if(data.success){
        setContent(data.content)
        ;}
        else{
          toast.error("Failed to generate article. Please try again.");
        }
    } catch (error) {
      toast.error("An error occurred while generating the article.");
      console.error("Article generation error:", error);
    }
    // TODO: wire generation
    setLoading(false);
  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
  {/* Form Section */}
  <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
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

        <label className="mt-4 block text-sm font-medium">Article Length</label>
        <div className="flex mt-3 gap-3 flex-wrap">
          {articleLength.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer focus:outline-none ${
                selectedLength.text === item.text
                  ? "border-2 border-blue-600 text-blue-600 font-medium bg-white shadow-sm"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>

  <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] animated-gradient-hover text-white px-4 py-2 mt-6 text-sm rounded-full" onClick={onSubmitHandler}>
          <Edit className="w-5" />
          Generate Article
        </button>
      </form>

  {/* Results placeholder */}
  <div className="flex-1 p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[220px] max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>
        {!content ? (<div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-6 h-6 text-gray-300" />
            <p>Enter a topic and click "Generate Article" to get started</p>
          </div>
        </div>) : (
          <div className="mt-4 overflow-y-scroll max-h-[520px] prose prose-sm prose-slate">
          {loading ? (
            <p>Generating article, please wait...</p>
          ) : (
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
          ) }
        </div>
        ) }
        
      </div>
    </div>
  );
};

export default WriteArticle;
