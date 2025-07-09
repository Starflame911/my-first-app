import React, { useEffect } from 'react';

import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; 


import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  useEffect(() => {
    const showWelcome = sessionStorage.getItem("welcomeUser");

    if (showWelcome) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);

          toast.success(`Welcome, ${decoded.name}! 👋`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        } catch (err) {
          console.error("Invalid token");
        }
      }

      sessionStorage.removeItem("welcomeUser"); // Show toast only once
    }
  }, []);


  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}

export default Home