import { useState } from "react";
import { login } from "../hooks/auth";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/Buttons/LoadingButton";
import Input from "@/components/Input";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mfaCode, setMfaCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showMfaInput, setShowMfaInput] = useState<boolean>(false);
  const [tempToken, setTempToken] = useState<string>("");
  const { setToken, setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const response = await login(email, password);
      console.log(response);
      if (response.mfaRequired) {
        setShowMfaInput(true);
        setTempToken(response.tempToken);
        toast.success("Please enter the MFA code sent to your email");
      } else {
        finishLogin(response.user, response.token);
      }
    } catch (error: any) {
      toast.error(error.response.data);
      // handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) {
      toast.error("Please enter the MFA code");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URI}/auth/verify-mfa`, {
        mfaCode,
        tempToken
      });
      finishLogin(response.data.user, response.data.token);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const finishLogin = (user: any, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    toast.success("Logged in successfully");
    navigate("/");
  };

  const handleError = (error: any) => {
    if (error.response?.data) {
      toast.error(error.response.data);
    } else {
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <div className="mt-20 flex-col w-full flex items-center justify-center space-y-6">
      <h1 className="text-center font-semibold text-3xl text-black">Login</h1>
      <div className="flex justify-center">
        <div className="bg-white md:w-[400px] rounded-lg shadow-xl border p-8 w-full max-w-md">
          {!showMfaInput ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="mb-3">
                  <Input
                    label="Email"
                    type="text"
                    disabled={loading}
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    label="Password"
                    type="password"
                    id="password"
                    disabled={loading}
                    name="password"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div>
                <LoadingButton
                  isLoading={loading}
                  onClick={handleSubmit}
                  text="Login"
                />
              </div>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              <div className="mb-3">
                <Input
                  label="MFA Code"
                  type="text"
                  disabled={loading}
                  id="mfaCode"
                  name="mfaCode"
                  onChange={(e) => setMfaCode(e.target.value)}
                  value={mfaCode}
                  placeholder="Enter MFA code"
                />
              </div>
              <div>
                <LoadingButton
                  isLoading={loading}
                  onClick={handleMfaSubmit}
                  text="Verify MFA"
                />
              </div>
            </form>
          )}
          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-violet-500 hover:text-violet-600 text-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;