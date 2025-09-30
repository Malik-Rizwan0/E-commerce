import { useRef, useEffect, useState } from "react";
import './LoginSignUp.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors , loadUser  } from "../../features/UserSlice.js";
import { useNavigate, useLocation, Link , Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from '../layouts/CircularProgressWithLabel.jsx';


const LoginSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { error, loading, isAuthenticated } = useSelector((state) => state.user);

  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const switcherRef = useRef(null);

  const [form, setForm] = useState({
    login: { email: "", password: "" },
    register: { name: "", email: "", password: "" },
    avatar: null,
    avatarPreview: "/Profile.png",
  });

  const redirect = new URLSearchParams(location.search).get("redirect") || "/account";
 

  const [firstLoad, setFirstLoad] = useState(true);


useEffect(() => {
  if (error) {
    enqueueSnackbar(error, { variant: "error" });
    dispatch(clearErrors());
  }
  if (isAuthenticated && firstLoad) {
    setFirstLoad(false);
    enqueueSnackbar("Login successful", { variant: "success" });
    navigate(redirect);
  }
}, [error, isAuthenticated, dispatch, enqueueSnackbar, navigate, redirect]);

  const handleChange = (e, type) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          avatar: files[0],
          avatarPreview: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [type]: { ...prev[type], [name]: value },
      }));
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form.login));
  };
const handleRegisterSubmit = (e) => {
  e.preventDefault(); // prevents page refresh

  const formData = new FormData();

  // Destructure values from form state
  const { name, email, password } = form.register;

  // Append them to FormData
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  console.log(name, email , password ,form.avatar);
  // Append avatar file if selected
  if (form.avatar) {
    formData.append("avatar", form.avatar);
  }
  console.log("FORMDATA CHECK", [...formData.entries()]);
  // Dispatch Redux action with formData
  dispatch(register(formData));
};


  const switchTabs = (tab) => {
    if (tab === "login") {
      switcherRef.current.classList.add("shiftToNeutral");
      switcherRef.current.classList.remove("shiftToRight");
      registerRef.current.classList.remove("shiftToNeutralForm");
      loginRef.current.classList.remove("shiftToLeft");
    } else {
      switcherRef.current.classList.remove("shiftToNeutral");
      switcherRef.current.classList.add("shiftToRight");
      registerRef.current.classList.add("shiftToNeutralForm");
      loginRef.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Box className="LoginSignUpContainer">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="LoginSignUpBox">
          <Box className="login_signUp_toggle">
            <Typography onClick={() => switchTabs("login")} >LOGIN</Typography>
            
            <Typography onClick={() => switchTabs("register")}>REGISTER</Typography>
          </Box>
          <Button ref={switcherRef} />

          {/* Login Form */}
          <form ref={loginRef} className="loginForm" onSubmit={handleLoginSubmit}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.login.email}
              onChange={(e) => handleChange(e, "login")}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.login.password}
              onChange={(e) => handleChange(e, "login")}
            />
            <Link to="/password/forgot">Forget Password?</Link>
            <Button type="submit" className="loginBtn">
              Login
            </Button>
          </form>

          {/* Register Form */}
          <form
            ref={registerRef}
            className="signUpForm"
            encType="multipart/form-data"
            onSubmit={handleRegisterSubmit}
          >
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.register.name}
              onChange={(e) => handleChange(e, "register")}
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.register.email}
              onChange={(e) => handleChange(e, "register")}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={form.register.password}
              onChange={(e) => handleChange(e, "register")}
            />
            <Box id="registerImage">
              <Avatar src={form.avatarPreview} sx={{ width: 56, height: 56 }} />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => handleChange(e, "register")}
              />
            </Box>
            <Button type="submit" className="signUpBtn" >
              Register
            </Button>
          </form>
        </Box>
       )} 
    </Box>
  );
};

export default LoginSignUp;
