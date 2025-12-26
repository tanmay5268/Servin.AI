import { Scissors, Sparkles } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import { useAuth } from '@clerk/clerk-react';
const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const {getToken} = useAuth();
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', input);
        formData.append('object', object);
        const token = await getToken();
        const { data } = await axios.post(
          "/api/ai/remove-image-object",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setContent(data.content);
        toast.success('Object removed successfully!');
        
      } catch (error) {
        toast.error('Failed to remove object. Please try again.');
        console.error('Object removal error:', error);
      }
      setLoading(false);
    };
  return (
    <div
      className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4
text-slate-700"
    >
      {/* Form Section */}
      <form id = {`${getToken()}`}
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe object name to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g, remove person, car, tree......."
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF9] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-full cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>
      {/* Result Section */}
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
border-gray-200 min-h-96"
      >
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div
              className="text-sm flex flex-col items-center gap-5
text-gray-400"
            >
              <Scissors className="w-full h-10 " />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div>
            <img
              src={content}
              alt="Processed"
              className="mt-4 rounded-md max-h-[500px] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RemoveObject
