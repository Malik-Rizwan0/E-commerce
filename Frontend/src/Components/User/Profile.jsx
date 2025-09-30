import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import Loader from "../layouts/CircularProgressWithLabel";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${user.name}'s Profile`} />
          <div className="profileContainer">
            {/* LEFT SECTION */}
            <div className="profileLeft">
              <h1 className="profileTitle">My Profile</h1>
              <img
                className="profileAvatar"
                src={user.avatar?.url}
                alt={user.name}
              />
              <Link className="editProfileBtn" to="/profile/update">
                Edit Profile
              </Link>
            </div>

            {/* RIGHT SECTION */}
            <div className="profileRight">
              <div className="profileInfo">
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>

              <div className="profileInfo">
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>

              <div className="profileInfo">
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substring(0, 10)}</p>
              </div>

              <div className="profileActions">
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
