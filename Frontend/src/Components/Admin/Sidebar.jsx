import "./Sidebar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button (only shows on mobile) */}
      <button
        className={`sidebar-toggle  ${open ?"CloseIcon" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <CloseIcon /> : <KeyboardArrowRightIcon />}
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <Link to="/">
          {/* <img src={logo} alt="Ecommerce" /> */}
        </Link>
        <Link to="/admin/dashboard">
          <p>
            <DashboardIcon /> Dashboard
          </p>
        </Link>

        <SimpleTreeView
          slots={{
            collapseIcon: ExpandMoreIcon,
            expandIcon: ImportExportIcon,
          }}
        >
          <TreeItem itemId="1" label="Products">
            <Link to={"/admin/products"}>
            <TreeItem
              itemId="2"
              label="All"
              component={Link}
              to="/admin/products"
              icon={<PostAddIcon />}
              />
              </Link>
              <Link to={"/admin/product"}>
            <TreeItem
              itemId="3"
              label="Create"
              component={Link}
              to="/admin/product"
              icon={<AddIcon />}
              />
              </Link>
          </TreeItem>
        </SimpleTreeView>

        <Link to="/admin/orders">
          <p>
            <ListAltIcon /> Orders
          </p>
        </Link>
        <Link to="/admin/users">
          <p>
            <PeopleIcon /> Users
          </p>
        </Link>
        <Link to="/admin/reviews">
          <p>
            <RateReviewIcon /> Reviews
          </p>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
