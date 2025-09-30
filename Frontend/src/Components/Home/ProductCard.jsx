import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import './Home.css';
const ProductCard = ({ product }) => {
  const options = {
    edit: true,
    color: 'rgba(20,20,20,0.1)',
    activeColor: '#FDCC0D ',
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };

  return (
    
    <Link className="ProductCard" to={`/product/${product._id}`}>
      <img src={product.images?.[0]?.url} alt={product.name} />
      <h3>{product.name}</h3>
      <div className="ratings">
        <Rating
          value={options.value}
          precision={options.isHalf ? 0.5 : 1}
          readOnly={options.edit}
          size={options.size <= 20 ? 'small' : 'medium'}
          sx={{
            color: options.color,
            '& .MuiRating-iconFilled': {
              color: options.activeColor,
            },
            '& .MuiRating-iconEmpty': {
              color: options.color,
            },
          }}
        />
        <span>({product.numOfReviews})</span>
      </div>
      <span>PKR &nbsp; {product.price}</span>
    </Link>
  );
};

export default ProductCard;
