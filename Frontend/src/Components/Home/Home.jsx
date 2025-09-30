import { useEffect  } from 'react';
import MetaData from '../layouts/MetaData.jsx';
import './Home.css';
import ProductCard from './ProductCard.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/productSlice.js';
import CircularProgressWithLabel from '../layouts/CircularProgressWithLabel.jsx';
import { useSnackbar } from 'notistack';


function Home() {
  const { enqueueSnackbar } = useSnackbar();
  
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  


  useEffect(() => {
    dispatch(getProducts({}))
      .unwrap()      
      .catch((err) => enqueueSnackbar(err, { variant: 'error' }));
  }, [dispatch]);
  return (
    <>
      {loading ? <CircularProgressWithLabel /> :
        <>

          <MetaData title="RIZ Store" />
          <div className="banner">
            <p>You’ve just found your new favorite place to shop!</p>
            <h1>Welcome to RIZ Store</h1>
            <p>Let’s make your shopping experience as exciting as opening a gift!</p>
            <a href="#featureProduct">
              <button className="font-bold py-2 px-4 rounded inline-flex items-center">
                <svg
                  className="fill-current w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Scroll Down</span>
              </button>
            </a>
          </div>

          <h2 className="heading" id="featureProduct">Feature Product</h2>
          <div className="featureContainer">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : products && products.length > 0 ? (
              products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))
            ) : (
              <p>No products found.</p> // 👈 Add this fallback
            )}
          </div>
        </>
      }
    </>
  );
}

export default Home;
