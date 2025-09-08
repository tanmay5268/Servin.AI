import React,{useEffect, useState} from 'react'
import {useUser} from '@clerk/clerk-react'
import {dummyPublishedCreationData} from '../assets/assets'
import { Heart } from 'lucide-react';

const Community = () => {
  const [creations, setCreations]= useState([]);
  const {user}=useUser();
  const fetchCreations= async()=>{
    setCreations(dummyPublishedCreationData)
  }

  // Toggle like for a creation locally (since we're using dummy data)
  const toggleLike = (id) => {
    if (!user?.id) return; // require signed-in user
    setCreations(prev => prev.map(item => {
      if (item.id !== id) return item;
      const hasLiked = item.likes.includes(user.id);
      const nextLikes = hasLiked
        ? item.likes.filter(uid => uid !== user.id)
        : [...item.likes, user.id];
      return { ...item, likes: nextLikes };
    }));
  }
  useEffect(()=>{
    if(user){
      fetchCreations();
    }
  },[user])
  return (
    <div className='flex-1 h-full p-6'>
      <h1 className='mb-4 text-lg font-semibold text-slate-700'>Creations</h1>
      <div className='bg-white h-full rounded-xl overflow-y-auto p-3'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {creations.map((creation, index) => (
            <div key={index} className='relative group rounded-lg overflow-hidden'>
              <img
                src={creation.content}
                alt=""
                className='w-full h-64 object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]'
              />
              {/* Overlay */}
              <div className='absolute inset-0 flex items-end justify-end p-3 text-white bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out'>
                <p className='text-sm hidden group-hover:block mr-auto'>{creation.prompt}</p>
                <div className='flex items-center gap-1'>
                  <p>{creation.likes.length}</p>
                  <Heart
                    onClick={(e) => { e.stopPropagation(); toggleLike(creation.id); }}
                    className={`w-5 h-5 hover:scale-110 transition-transform cursor-pointer ${creation.likes.includes(user?.id) ? 'fill-red-500 text-red-600' : 'text-white'}`}
                    aria-label={creation.likes.includes(user?.id) ? 'Unlike' : 'Like'}
                    role="button"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
