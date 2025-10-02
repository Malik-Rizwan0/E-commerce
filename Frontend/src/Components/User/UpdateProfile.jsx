import { Fragment, useState, useEffect } from "react";
import "./UpdateProfile.css";
import Loader from "../layouts/CircularProgressWithLabel";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FaceIcon from "@mui/icons-material/Face";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser, clearErrors, resetUpdate } from "../../features/UserSlice.js";
import { useSnackbar } from "notistack";
import MetaData from "../layouts/MetaData.jsx";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { user, error, isUpdated, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
  }, [error, dispatch, enqueueSnackbar]);

  useEffect(() => {
    if (isUpdated) {
      enqueueSnackbar("Profile Updated Successfully", { variant: "success" });
      dispatch(loadUser());
      navigate("/account");
      dispatch(resetUpdate());
    }
  }, [isUpdated, dispatch, enqueueSnackbar, navigate]);

const updateProfileSubmit = (e) => {
  e.preventDefault();
  const myForm = new FormData();
  myForm.append("name", name);
  myForm.append("email", email);
  if (avatar) {
    myForm.append("avatar", avatar); // Append the file directly
  }
  dispatch(updateProfile(myForm));
};
  const updateProfileDataChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setAvatar(file); // Store the file object directly
  setAvatarPreview(URL.createObjectURL(file)); // Create preview URL
};

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>
              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
