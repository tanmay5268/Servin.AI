import React from 'react'
import { PricingTable } from '@clerk/clerk-react'
const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 mb-20'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] fint-semibold'>All features are completely free. No limits, no subscriptions.</h2>
        {/* <p className='text-grey-500 max-w-lg mx-auto'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p> */}
      </div>
      {/* <div className='mt-14 max-sm:mx-8 pricing-table-no-ticks'>
        <PricingTable />
      </div> */}
    </div>
  )
}

export default Plan
