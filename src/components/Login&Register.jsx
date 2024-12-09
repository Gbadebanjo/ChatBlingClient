import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { toast, ToastContainer } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";


export default function LoginRegister () {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const { setUsernameDetails, setId } = useContext(UserContext);

 
  const RegisterAndLogin = async (ev) => {
    ev.preventDefault();
    try {
      const url = isLoginOrRegister === "register" ? "/register" : "/login";
      const {data}  = await axios.post(url, { username, password });
      setUsernameDetails(data.username);
      setId(data.userId);
      toast.success(data.message);
      // console.log(data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="bg-custom-blue h-screen flex items-center">
      <form className="w-80 mx-auto" onSubmit={RegisterAndLogin}>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="Username"
          className="block w-full rounded p-2 mb-2 border"
        />
        <div className="relative">
          <input
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="block w-full rounded p-2 mb-2"
          />
          <button
            type="button"
            className="absolute right-2 top-3 text-blue-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
          </button>
        </div>
        <button className="bg-blue-700 hover:bg-white text-white hover:text-blue-700 font-bold py-2 px-4 mt-2 rounded w-full">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center pt-2 ">
          {isLoginOrRegister === "register" && (
            <div className="text-white">
              Already a member?
              <button
                onClick={() => setIsLoginOrRegister("login")}
                className="text-red-500 ml-1"
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div className="text-white">
              Not a member?
              <button
                onClick={() => setIsLoginOrRegister("register")}
                className="text-red-500 ml-1"
              >
                Register here
              </button>
            </div>
          )}
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

