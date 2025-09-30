import { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProducts } from "../../features/productSlice";
import Loader from "../layouts/CircularProgressWithLabel";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import MetaData from "../layouts/MetaData";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
];

const Products = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { keyword } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 80000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

    const [showFilters, setShowFilters] = useState(false);

    const {
        products,
        loading,
        error,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    } = useSelector((state) => state.product);

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        dispatch(getProducts({ keyword, currentPage, category, ratings }));
    }, [dispatch, keyword, currentPage, category, ratings, error, enqueueSnackbar]);

    let count = filteredProductsCount;
    const clearFilters = () => {
        setPrice([0, 80000]);
        setCategory("");
        setRatings(0);
        setCurrentPage(1);
        
         dispatch(getProducts({ keyword, currentPage, category: "", ratings: 0 }));
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="PRODUCTS -- ECOMMERCE" />
                    <h2 className="productsHeading m-1">Products</h2>

                    {/* Mobile Toggle Button */}
                    <div className="md:hidden flex justify-center mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-[tomato] text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    <div className=" flex flex-col md:flex-row gap-6 px-2 md:px-4">
                        {/* Filter Box */}
                        <div
                            className={`md:block filterBox ${showFilters ? "block" : "hidden"
                                } md:w-1/4 w-full bg-white p-4 rounded shadow-md`}
                        >
                            <div className="mb-6">
                                <Typography className="text-sm font-medium text-gray-700 mb-1">Price</Typography>
                                <Slider
                                    value={price}
                                    onChange={(e, newPrice) => setPrice(newPrice)} // only update UI
                                    onChangeCommitted={(e, newPrice) => {
                                        dispatch(getProducts({ keyword, currentPage, price: newPrice, category, ratings }));
                                    }}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={80000}
                                    step={100}
                                    sx={{
                                        color: 'tomato',
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                                boxShadow: '0px 0px 0px 8px rgba(255, 99, 71, 0.16)',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className="mb-6">
                                <Typography className="text-sm font-medium text-gray-700 mb-1">Categories</Typography>
                                <ul className="space-y-2">
                                    {categories.map((cat) => (
                                        <li
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className="cursor-pointer text-gray-600 hover:text-[tomato] hover:underline transition"
                                        >
                                            {cat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <Typography className="text-sm font-medium text-gray-700 mb-1">Ratings Above</Typography>
                                <Slider
                                    value={ratings}
                                    onChange={(e, newRating) => setRatings(newRating)}
                                    aria-labelledby="continuous-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={5}
                                    sx={{
                                        color: 'tomato'
                                    }}
                                />
                            </div>
                            <button
                                onClick={clearFilters}
                                className="mt-4 w-full px-4 py-2 bg-[tomato] text-white rounded hover:bg-red-600 transition"
                            >
                                Clear Filters
                            </button>
                        </div>

                        {/* Product Grid */}
                        <div className="featureContainer">
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 h-100 d-flex flex-col items-center justify-center align-center">
                                    <h2 className="text-xl font-semibold text-gray-500">No Products Found</h2>
                                    <p className="text-gray-400 mt-2">Try adjusting your filters or searching something else.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom Pagination */}
                    {resultPerPage < count && (
                        <div className="flex justify-center my-8">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="⇒"
                                prevPageText="⇐"
                                firstPageText="1st"
                                lastPageText="last"
                                itemClass="mx-1"
                                linkClass="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-red-100 hover:text-[tomato] transition"
                                activeLinkClass="bg-[tomato] text-white"
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Products;
