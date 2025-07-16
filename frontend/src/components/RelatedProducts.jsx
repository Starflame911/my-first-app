import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import axios from 'axios';

const RelatedProducts = ({ category, subCategory }) => {
  const { backendUrl } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/filter?category=${category}&subCategory=${subCategory}&limit=5`);
        if (res.data.products) {
          setRelated(res.data.products);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (category && subCategory) {
      fetchRelatedProducts();
    }
  }, [category, subCategory, backendUrl]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
