import React, { useState, useEffect, useContext } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    delivery_fee,
    currency,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
  });

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (cartData.length === 0) return;

      try {
        const ids = cartData.map(item => item._id).join(',');
        const res = await axios.get(`${backendUrl}/api/product/bulk?ids=${ids}`);
        const map = {};
        res.data.products.forEach(p => {
          map[p._id] = p;
        });
        setProductMap(map);
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product data.');
      }
    };

    fetchProducts();
  }, [cartData, backendUrl]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const item of cartData) {
        const product = structuredClone(productMap[item._id]);
        if (product) {
          product.size = item.size;
          product.quantity = item.quantity;
          orderItems.push(product);
        }
      }

      let totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      totalAmount += delivery_fee;

      const orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount,
      };

      if (method === 'cod') {
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems({});
          navigate('/orders');
        } else {
          toast.error(response.data.message);
        }
      } else if (method === 'stripe') {
        const response = await axios.post(
          `${backendUrl}/api/order/stripe`,
          orderData,
          { headers: { token } }
        );

        if (response.data.success) {
          window.location.replace(response.data.session_url);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'
    >
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1='DELIVERY' text2='INFORMATION' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='address' value={formData.address} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Delivery Address' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='pincode' value={formData.pincode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Pin Code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone Number' />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal cartData={cartData} productMap={productMap} />
        </div>
        <div className='mt-12'>
          <Title text1='PAYMENT' text2='METHOD' />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt='Stripe' />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
        </div>
        <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
