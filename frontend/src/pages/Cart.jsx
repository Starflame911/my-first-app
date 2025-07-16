import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';

const Cart = () => {
  const { cartItems, currency, updateQuantity, navigate, backendUrl } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  // Fetch actual product details for items in cart
  useEffect(() => {
    const fetchProducts = async () => {
      if (cartData.length === 0) return;

      try {
        const ids = cartData.map(item => item._id).join(',');
        const res = await axios.get(`${backendUrl}/api/product/bulk?ids=${ids}`);
        const products = res.data.products;

        const productMap = {};
        products.forEach(p => {
          productMap[p._id] = p;
        });

        setProductMap(productMap);
      } catch (error) {
        console.error('Error fetching products for cart:', error);
      }
    };

    fetchProducts();
  }, [cartData, backendUrl]);

  return (
    <div className='border-t pt-14'>
      {cartData.length === 0 ? (
        <div className='flex flex-col items-center justify-center text-center py-20 px-4'>
          <div className='w-[300px] sm:w-[450px] mb-6'>
            <DotLottieReact
              src="https://lottie.host/b6a056a0-2bfc-4bc6-9524-57755a6a3e25/IKh4ibPUY4.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <p className='text-lg text-gray-600 mb-4'>Your cart is empty</p>
          <button
            onClick={() => navigate('/collection')}
            className='bg-black text-white px-6 py-3 text-sm rounded'
          >
            SHOP NOW
          </button>
        </div>
      ) : (
        <>
          <div className='text-2xl mc-3'>
            <Title text1={'YOUR'} text2={'CART'} />
          </div>
          <div>
            {cartData.map((item, index) => {
              const productData = productMap[item._id];
              if (!productData) return null; // avoid blank if product not yet fetched

              return (
                <div
                  key={index}
                  className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                >
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={productData.image[0]} alt='' />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) =>
                      e.target.value === '' || e.target.value === '0'
                        ? null
                        : updateQuantity(item._id, item.size, Number(e.target.value))
                    }
                    className='border h-5 max-w-10 sm:max-w-20 px-1 sm:px-2 py-3'
                    type='number'
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className='w-3 mr-3 sm:w-4 cursor-pointer'
                    src={assets.bin_icon}
                    alt='Delete'
                  />
                </div>
              );
            })}
          </div>

          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal cartData={cartData} productMap={productMap} />
              <div className='w-full text-end'>
                <button
                  onClick={() => navigate('/place-order')}
                  className='bg-black text-white text-sm my-8 px-8 py-3'
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
