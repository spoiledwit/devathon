import { useState } from "react";
import { register } from "../hooks/auth";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import LoadingButton from "../components/Buttons/LoadingButton";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { setToken, setUser } = useAuthStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const { user, token } = await register(name, email, password);
      setUser(user);
      setToken(token);
      setLoading(false);
      toast.success("Registered successfully");
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      if (error.response?.data === "User already exists") {
        toast.error("User already exists");
        return;
      }
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <div className="mt-20 flex-col w-full flex items-center justify-center">
      <h1 className="text-center font-medium text-2xl text-black mb-6">
        Register
      </h1>
      <div className="flex  justify-center">
        <div className="w-full">
          <div className="bg-white md:w-[400px] rounded-lg shadow-lg border p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  label="Name"
                  type="text"
                  disabled={loading}
                  id="name"
                  name="name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Email"
                  type="text"
                  disabled={loading}
                  id="email"
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <Input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                  label="Password"
                  type="password"
                  id="password"
                  disabled={loading}
                  name="password"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex items-center justify-between">
                <LoadingButton
                  isLoading={loading}
                  onClick={handleSubmit}
                  text="Register"
                />
              </div>
            </form>
            {/* Route to login */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  className="text-violet-500 hover:text-violet-700 font-semibold"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
