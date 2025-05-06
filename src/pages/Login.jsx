// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import Swal from "sweetalert2";
import axiosInstance from "../services/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/institutions/login", null, {
        params: {
          email: form.username,
          password: form.password,
        },
      });
      if (response.status === 200) {
        sessionStorage.setItem("username", response.data.username);
        localStorage.setItem("token", "true");
        Swal.fire({
          title: "Logging you in...",
          text: "Successfully logged in to your account.",
          icon: "success",
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          timer: 1000,
        }).then(() => {
          navigate("/dashboard");
        });
        // Swal.fire({
        //   title: "Success!",
        //   text: "Successfully logged in to your account.",
        //   icon: "success",
        //   confirmButtonText: "OK",
        // }).then(() => {
        //   navigate("/dashboard");
        // });
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("Login submitted:", form);

  //     // const response = await axios.post(
  //     //   "http://localhost:8081/institutions/login",
  //     //   null, // 👈 no body
  //     //   {
  //     //     params: {
  //     //       email: form.username, // 👈 match backend param names
  //     //       password: form.password,
  //     //     },
  //     //   }
  //     // );

  //     const response = await axiosInstance.post(
  //       "/institutions/login",
  //       null, // No body; using query params
  //       {
  //         params: {
  //           email: form.username,
  //           password: form.password,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       // ✅ Save only the email in sessionStorage
  //       sessionStorage.setItem("username", response.data.username);
  //       console.log(sessionStorage.getItem("username"));
  //       localStorage.setItem("token", "true"); // Or use a real token if available

  //       //If Want the All Object data in the sessionStorage then it required
  //       // sessionStorage.setItem('user', JSON.stringify(response.data));

  //       alert("Login successful!");
  //       navigate("/dashboard");
  //     } else {
  //       setError("Login failed");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     setError("Login failed");
  //   }
  // };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username (email)"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;

// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./Login.css";
// import Swal from "sweetalert2";
// import axiosInstance from "../services/axiosInstance";

// const Login = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");

//   // Listen for changes in other tabs using storage event
//   useEffect(() => {
//     const handleStorageChange = (e) => {
//       // Trigger alert if another tab logs in
//       if (e.key === "isLoggedIn" && e.newValue === "true") {
//         Swal.fire({
//           title: "Already Logged In!",
//           text: "You are already logged in from another tab.",
//           icon: "warning",
//           confirmButtonText: "OK",
//         });
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);

//     // Cleanup event listener on component unmount
//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//     };
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if user is already logged in by checking localStorage
//     if (localStorage.getItem("isLoggedIn") === "true") {
//       Swal.fire({
//         title: "Already Logged In!",
//         text: "You are already logged in from another tab.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     try {
//       const response = await axiosInstance.post("/institutions/login", null, {
//         params: {
//           email: form.username,
//           password: form.password,
//         },
//       });
//       if (response.status === 200) {
//         sessionStorage.setItem("username", response.data.username);
//         localStorage.setItem("token", "true");
//         localStorage.setItem("isLoggedIn", "true"); // Set logged-in flag in localStorage

//         Swal.fire({
//           title: "Logging you in...",
//           text: "Successfully logged in to your account.",
//           icon: "success",
//           showConfirmButton: false,
//           allowOutsideClick: false,
//           didOpen: () => {
//             Swal.showLoading();
//           },
//           timer: 1000,
//         }).then(() => {
//           navigate("/dashboard");
//         });
//       } else {
//         setError("Login failed");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username (email)"
//           value={form.username}
//           onChange={handleChange}
//           autoComplete="username"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           autoComplete="current-password"
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Login;
