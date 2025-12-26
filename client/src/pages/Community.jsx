import React,{useEffect, useState} from 'react'
import {useAuth, useUser} from '@clerk/clerk-react'
import { Heart, Loader2, ImageOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Community = () => {
  const [creations, setCreations]= useState([]);
  const {user}=useUser();
  const [loading,setLoading]=useState(true);
  const {getToken} = useAuth();
  const fetchCreations= async()=>{
    try{
      const {data} = await axios.get('/api/user/get-published-creations',{
        headers:{
          'Authorization': `Bearer ${await getToken()}`
        }
      });
      console.log('API Response:', data); // Debug: Check the response
      if(data.creations){
        console.log('Creations:', data.creations); // Debug: Check creations structure
        setCreations(data.creations);
      }
      else{
        toast.error('Failed to fetch creations');
      }
      
    }catch(error){
        toast.error('An error occurred while fetching creations');
      console.error('Error fetching creations:', error);
    }
    setLoading(false);
    
  }

  useEffect(()=>{
    if(user){
      fetchCreations();
    }
  },[user]);

  return (
    <div className='flex-1 h-full p-6'>
      <h1 className='mb-4 text-lg font-semibold text-slate-700'>Creations</h1>
      <div className='bg-white h-full rounded-xl overflow-y-auto p-3'>
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
          </div>
        ) : creations.length === 0 ? (
          <div className='flex flex-col justify-center items-center h-64 text-gray-400'>
            <ImageOff className='w-12 h-12 mb-2' />
            <p>No creations found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {creations.map((creation, index) => (
              <div key={creation._id || index} className='relative group rounded-lg overflow-hidden'>
                <img
                  src={creation.image || creation.content || creation.url}
                  alt={creation.prompt || 'Creation'}
                  className='w-full h-64 object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]'
                  onError={(e) => {
                    console.log('Image failed to load:', creation);
                    e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                  }}
                />
                {/* Overlay */}
                <div className='absolute inset-0 flex items-end justify-end p-3 text-white bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out'>
                  <p className='text-sm hidden group-hover:block mr-auto'>{creation.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
