import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({ cartData, productMap }) => {
  const { currency, delivery_fee } = useContext(ShopContext);

  // Calculate subtotal using cartData and productMap
  const subtotal = useMemo(() => {
    return cartData.reduce((total, item) => {
      const product = productMap[item._id];
      if (!product) return total;
      return total + product.price * item.quantity;
    }, 0);
  }, [cartData, productMap]);

  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>
            {currency} {subtotal === 0 ? '0.00' : delivery_fee.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <b>Total</b>
          <b>
            {currency} {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
