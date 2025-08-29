import React from 'react'
import servinAILogo from '../assets/servinai_logo.png'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser()
    const { openSignIn } = useClerk()




    return (
    <div className='fixed z-0 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
            <img
                src={servinAILogo}
                alt="Servin.AI logo"
                className='w-40 sm:w-56 cursor-pointer' // Increased width for bigger logo
                onClick={() => navigate('/')}
            />
            {
                user ? <UserButton />
                    :
                    (
                        <button onClick={openSignIn}
                            className="flex items-center gap-2 rounded-full text-sm cursor-pointer text-white px-10 py-2.5"
                            style={{ background: 'var(--color-primary)' }}
                        >
                            Get started <ArrowRight />
                        </button>
                    )
            }


        </div>
    )
}

export default Navbar
