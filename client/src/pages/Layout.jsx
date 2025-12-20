import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import servin from '../assets/servinai_logo.png'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useUser, SignIn } from '@clerk/clerk-react'



const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col h-screen items-start border-b border-gray-200 justify-start'>
      <nav className='w-full px-10 min-h-10 flex items-center justify-between border-b border-gray-200'>
        <img className='cursor-pointer w-32 sm:w-44 ' src={servin} alt='' onClick={() => navigate('/')} />
        {
          sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' /> : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-660 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)] '>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-gray-100'>
          <Outlet />
        </div>
      </div>



    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" /><SignIn />
    </div>
  )
}

export default Layout
