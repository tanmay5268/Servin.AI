import React from 'react'
import { AiToolsData } from '../assets/assets'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom' 
import { useUser } from '@clerk/clerk-react'    

const AiTools = () => {
    const navigate=useNavigate();
    const { user } = useUser();
    return (
        <div className='px-4 sm:px-20 xl:px-32 my-24'>
            <div className='text-center mb-6'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>
                    Powerful AI Tools
                </h2>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto
                max-sm:text-xs text-gray-600'>
                    Explore our AI-powered tools for text generation, image creation, and data analysis to enhance your content creation process.
                </p>
            </div>
            <div className='flex flex-wrap justify-center mt-10'>
                {AiToolsData.map((tool,index)=>(
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-[0_4px_24px_0_rgba(255,0,142,0.15)] border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={()=>user && navigate(tool.path)}>
                        <tool.Icon className='w-12 h-12 p-3 text-white rounded-full' style= {{background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool. bg.to})`}}/>

                        <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
                        <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                        

                    </div>
                ))}
                
            </div>
        </div>
    )
}

export default AiTools
