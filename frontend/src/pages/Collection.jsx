import React, { useEffect, useRef, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { backendUrl } from '../../../admin/src/App';
import { ShopContext } from '../context/ShopContext'; // ✅ Added

const Collection = () => {
  const {
    search, showSearch, page, setPage // ✅ Pull from context
  } = useContext(ShopContext);

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const fetchProducts = async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.append('page', reset ? 1 : page); // ✅ Use context page
    queryParams.append('limit', 10);
    if (category.length) category.forEach(cat => queryParams.append('category', cat));
    if (subCategory.length) subCategory.forEach(sub => queryParams.append('subCategory', sub));
    if (sortType !== 'relevant') queryParams.append('sort', sortType);
    if (showSearch && search) queryParams.append('search', search);

    try {
      const res = await fetch(`${backendUrl}/api/product/filter?${queryParams.toString()}`);
      const data = await res.json();

      if (reset) {
        setProducts(data.products);
        setPage(2); // ✅ From context
      } else {
        setProducts(prev => [...prev, ...data.products]);
        setPage(prev => prev + 1); // ✅ From context
      }

      setHasMore(data.products.length === 10);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  // Refetch on filter/sort/search change
  useEffect(() => {
    setPage(1); // ✅ Reset page when filters change
    fetchProducts(true);
  }, [category, subCategory, sortType, search, showSearch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50
      ) {
        fetchProducts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products, hasMore, isLoading]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Left Filter Panel */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Men', 'Women', 'Kids'].map(option => (
              <label key={option} className='flex gap-2'>
                <input className='w-3' type='checkbox' value={option} onChange={toggleCategory} checked={category.includes(option)} />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map(option => (
              <label key={option} className='flex gap-2'>
                <input className='w-3' type='checkbox' value={option} onChange={toggleSubCategory} checked={subCategory.includes(option)} />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Product Grid */}
      <div className='flex-1'>
        <div className='flex justify-between items-center mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6'>
          {products.length > 0 ? (
            products.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))
          ) : (
            <p className='text-gray-500 text-sm col-span-full'>No products found.</p>
          )}
        </div>

        {isLoading && (
          <div className='text-center py-4 text-sm text-gray-600'>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
