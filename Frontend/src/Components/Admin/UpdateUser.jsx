import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import MetaData from "../layouts/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SideBar from "./Sidebar";
import { getUserDetails, updateUser, clearErrors, resetUpdate } from "../../features/UserSlice";
import CircularProgressWithLabel from "../layouts/CircularProgressWithLabel";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id: userId } = useParams();


    // ✅ Local states for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  
 const { loading, error, selectedUser } = useSelector((state) => state.user);
const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.user);

useEffect(() => {
  if (!selectedUser || selectedUser._id !== userId) {
    dispatch(getUserDetails(userId));
  } else {
    setName(selectedUser.name);
    setEmail(selectedUser.email);
    setRole(selectedUser.role);
  }

  if (error) {
    enqueueSnackbar(error, { variant: "error" });
    dispatch(clearErrors());
  }

  if (updateError) {
    enqueueSnackbar(updateError, { variant: "error" });
    dispatch(clearErrors());
  }

  if (isUpdated) {
    enqueueSnackbar("User updated successfully", { variant: "success" });
    navigate("/admin/users");
    dispatch(resetUpdate());
  }
}, [dispatch, enqueueSnackbar, error, updateError, isUpdated, selectedUser, userId, navigate]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser({ id: userId, userData: myForm }));
  };

  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <CircularProgressWithLabel />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={updateLoading || role === ""}
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
