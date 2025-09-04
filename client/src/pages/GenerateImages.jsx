import { Image, ImageDown } from 'lucide-react';
import React, { useState } from 'react'
import { Edit, Hash, Sparkles } from "lucide-react";

const GenerateImages = () => {
  const ImageStyle = ['Realistic', '3D style', 'Cartoon', 'Pixel Art' , 'Ghibli', 'Anime style','Fantasy style','Portrait Style'];
        const [selectedStyle, setSelectedStyle] = React.useState('Realistic');
        const [input, setInput] = React.useState("");
        const [publish,setPublish]=useState(false);
        const onSubmitHandler = async (e) => {
          e.preventDefault();
        }
  return (
    <div
      className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4
text-slate-700"
    >
      {/* Form Section */}
        <form onSubmit={onSubmitHandler}
          className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-[#00AD25]" />
            <h1 className="text-xl font-semibold">AI Image Generator</h1>
          </div>
          <p className="mt-6 text-sm font-medium">Describe Your Image</p>
          <textarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            rows={4}
            className="w-full p-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
            placeholder="A fantasy landscape with castles and dragons......."
            required
          />
          <p className="mt-4 text-sm font-medium">Style</p>
          <div className="flex mt-3 gap-3 flex-wrap">
            {ImageStyle.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSelectedStyle(item)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer focus:outline-none ${
              selectedStyle === item
            ? "border-2 border-green-600 text-green-600 font-medium bg-white shadow-sm"
            : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
            ))}
          </div>
          <div className='my-6 flex items-center gap-2'> 
            <label className='relative cursor-pointer'>
              <input type='checkbox' className='peer sr-only'  onChange={(e)=>setPublish(e.target.checked)} checked={publish} />
              <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500  transition'></div>
              <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>

            </label>
            <p className='text-sm'>Make this image public</p>
          </div>
          <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-full cursor-pointer">
            <Image className="w-5" />
            Generate Images
          </button>
        </form>
        {/* Result Section */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
border-gray-200 min-h-96">
            <div className="flex items-center gap-3">
              <Image className="w-5 h-5 text-[#00AD25]" />
              <h1 className="text-xl font-semibold">Generated Titles</h1>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="text-sm flex flex-col items-center gap-5
text-gray-400">
  <Image className="w-full h-10 " />
  <p>Enter your prompt and click "Generate Images" to get started</p>
</div>

            </div>

      </div>
    </div>
      
  )
}

export default GenerateImages
