import React ,{useEffect, useState}from 'react'
import {dummyCreationData} from '../assets/assets'
import { Gem, Sparkles } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'

const Dashboard = () => {
  const[creations,setCreations]=useState([])
  const getDashboardData=async()=>{
    setCreations(dummyCreationData)
  }
  useEffect(()=>{
    getDashboardData()
  },[])




  return (
    <div className='h-full  p-6'>
      <div className='flex justify-start gap-4  flex-wrap'>
        {/*Total Creations card*/}
        <div className='flex shadow-[0_4px_24px_0_rgba(128,90,213,0.30)] justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-400'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white'/>
          </div>
        </div>
        {/*Active plan*/}
        <div className='flex shadow-[0_4px_24px_0_rgba(128,90,213,0.30)] justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-400'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>
              <Protect plan='full_access' fallback='free_user'>Premium</Protect>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white'/>
          </div>
        </div>

      </div>

      <div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creations</p>
      </div>



    </div>
  )
}

export default Dashboard
