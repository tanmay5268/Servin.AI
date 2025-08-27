import React from 'react'
import Navbar from '../components/navbar' // Capitalized
import Hero from '../components/hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <AiTools/>
      <Testimonial/>
    </>
  )
}

export default Home
