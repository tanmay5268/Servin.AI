import React ,{useEffect, useState}from 'react'
import {dummyCreationData} from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const[creations,setCreations]=useState([])
  const { getToken } = useAuth();
  const[loading,setLoading]=useState(false);
  const getDashboardData=async()=>{
    try{
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      console.log("API Response:", data); // Debug: Check the response
      if (data.creations) {
        console.log("Creations:", data.creations); // Debug: Check creations structure
        setCreations(data.creations);
      } else {
        toast.error("Failed to fetch creations");
      } 
    }catch
    (error){
      toast.error("Failed to fetch dashboard data.");
      console.error("Dashboard data fetch error:", error);
    }
    setLoading(false);
  }
  useEffect(()=>{
    getDashboardData()
  },[])




  return (
    <div className='h-full  p-6 overflow-y-scroll space-y-6'>
      <div className='flex justify-start gap-4  flex-wrap'>
        {/*Total Creations card*/}
        <div className='flex justify-around items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-400'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white'/>
          </div>
        </div>
        {/*Active plan*/}
        {/* <div className='flex  justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-400'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='full_access' fallback='free_user'>Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white'/>
          </div>
        </div> */}

      </div>

      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations</p>
        {
          creations.map((item)=><CreationItem key={item.id} item={item}/>)
        }
      </div>



    </div>
  )
}

export default Dashboard
