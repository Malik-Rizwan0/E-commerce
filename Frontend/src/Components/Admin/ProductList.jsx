import { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import MetaData from "../layouts/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { useMediaQuery } from "@mui/material";



// ✅ Import from productSlice
import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
  resetDeleteProduct,
} from "../../features/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // ✅ Single selector (no duplicate error states)
  const { error, products, isDeleted } = useSelector((state) => state.product);

  const isMobile = useMediaQuery("(max-width:768px)");

  // ✅ Delete handler
  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      enqueueSnackbar("Product Deleted Successfully", { variant: "success" });
      navigate("/admin/dashboard");
      dispatch(resetDeleteProduct());
    }

    dispatch(getAdminProducts());
  }, [dispatch, enqueueSnackbar, error, navigate, isDeleted]);

  // ✅ DataGrid columns

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5, hide: isMobile },
    { field: "name", headerName: "Name", minWidth: 120, flex: 1 },
    { field: "stock", headerName: "Stock", type: "number", minWidth: 100, flex: 0.3, hide: isMobile },
    { field: "price", headerName: "Price", type: "number", minWidth: 100, flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Fragment>
          <Link to={`/admin/product/${params.row.id}`}>
            <EditIcon fontSize="small" />
          </Link>
          <Button onClick={() => deleteProductHandler(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </Button>
        </Fragment>
      ),
    },
  ];

  // ✅ Rows
  const rows =
    products?.map((item) => ({
      id: item._id,
      stock: item.stock,
      price: item.price,
      name: item.name,
    })) || [];

  return (
    <Fragment>
      <MetaData title="ALL PRODUCTS - Admin" />
      <div className="dashboard">
        <SideBar className="sidebar"/>
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            columnVisibilityModel={{
              id: !isMobile,
              stock: !isMobile,
            }}
            disableRowSelectionOnClick
            autoHeight
            className="productListTable"
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;
