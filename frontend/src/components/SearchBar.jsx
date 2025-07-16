import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    setPage,     // RESET to page 1 when new search begins
  } = useContext(ShopContext);

  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('collection')) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Reset pagination on new search term
  };

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
        <input
          value={search}
          onChange={handleInputChange}
          className='flex-1 outline-none bg-inherit text-sm'
          type='text'
          placeholder='Search'
        />
        <img className='w-4' src={assets.search_icon} alt='Search' />
      </div>
      <img
        onClick={() => {
          setShowSearch(false);
          setSearch('');
          setPage(1);
        }}
        className='inline w-3 cursor-pointer'
        src={assets.cross_icon}
        alt='Close'
      />
    </div>
  ) : null;
};

export default SearchBar;
