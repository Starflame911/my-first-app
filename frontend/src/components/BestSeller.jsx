import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const BestSeller = () => {
  const { backendUrl } = useContext(ShopContext); // ensure this exists
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/filter?bestseller=true&limit=5`);
        if (res.data.products) {
          setBestSeller(res.data.products);
        }
      } catch (err) {
        console.error('Error fetching bestseller products:', err);
      }
    };

    fetchBestSellers();
  }, [backendUrl]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam perferendis obcaecati adipisci, asperiores natus temporibus nulla vero
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
