import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Mail, Lock, Eye, EyeClosed, UserRound } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, showAlert] = useState({ message: "", show: false });

  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
    },
  });

  const toggleFormMode = () => setIsLogin(!isLogin);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // LOGIN HANDLER
const loginUser = async (values) => {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed. Please try again.");
    }

    // Store token & user in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showAlert({ show: true, message: "Login successful!" });
    navigate("/");
  } catch (error) {
    showAlert({ show: true, message: error.message });
  }
};

// SIGNUP HANDLER
const signupUser = async (values) => {
  try {
    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
        // Remove firstName / lastName if backend doesn't support them
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || "Signup failed. Please try again.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showAlert({ show: true, message: "Signup successful! Welcome to SceneIt!" });
    reset();
    navigate("/");
  } catch (error) {
    showAlert({ show: true, message: error.message });
  }
};


  return (
    <section id="auth" className="w-full mt-28 text-gray-300 flex min-h-screen">
      {/* Left Column */}
      <div className="w-[55%] min-w-[400px] px-8 py-20">
        <h2 className="text-4xl mt-2 mb-10 font-semibold">
          Welcome to <br />
          <span className="text-green-600">SceneIt</span>
        </h2>

        {/* Feature Section */}
        {/* <ul className="space-y-5 mb-10 list-none">
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <Mail className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Save and Organize Recipes</b>
                <p>Build your personal cookbook with recipes you love</p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <UserRound className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Connect with other Chefs</b>
                <p>
                  Share recipes and discover new favorites from the community
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <PiChefHatBold className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Smart Meal Planning</b>
                <p>Plan your meals and generate shopping lists automatically</p>
              </div>
            </div>
          </li>
        </ul> */}

        {/* Dummy Stats */}
        {/* <div className="flex justify-around mt-10">
          <div className="flex flex-col space-y-1 text-center">
            <b className="text-2xl text-green-600">50K+</b>
            <p>Recipes</p>
          </div>
          <div className="flex flex-col space-y-1 text-center">
            <b className="text-2xl text-green-600">50K+</b>
            <p>Users</p>
          </div>
          <div className="flex flex-col space-y-1 text-center">
            <b className="text-2xl text-green-600">50K+</b>
            <p>Rating</p>
          </div>
        </div> */}
      </div>

      {/* Right Column */}
      <div className="w-[45%] min-w-[300px] px-8 py-20 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 p-10 border-2 border-gray-800/30 rounded-sm text-center">
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="flex justify-center items-center p-5 w-20 h-20 rounded-xl shadow-md shadow-green-600 bg-green-600 border-4 border-gray-200">
              <img src='/sceneit.png' className="text-gray-900/50 text-3xl" />
            </div>

            <h3 className="font-semibold text-2xl">
              {isLogin ? "Welcome Back!" : "Join SceneIt!"}
            </h3>

            <Alert alert={alert} showAlert={showAlert} />
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm
              handleSubmit={handleSubmit}
              loginUser={loginUser}
              register={register}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          ) : (
            <SignupForm
              handleSubmit={handleSubmit}
              signupUser={signupUser}
              register={register}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          )}

          <span>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a
              href="#"
              onClick={toggleFormMode}
              className="text-green-600 hover:underline cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}


function LoginForm({
  handleSubmit,
  loginUser,
  register,
  showPassword,
  togglePasswordVisibility,
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(loginUser)}
      autoComplete="on"
    >
      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          {...register("email")}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </button>
      </div>

      {/* Remember Me Checkbox and Forgot Password */}
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            autoComplete="remember-me"
            className="w-4 h-4"
          />
          Remember me
        </label>
        <a
          href="/forgot-password"
          className="text-green-600 hover:underline cursor-pointer"
        >
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-3 my-4 bg-green-500 text-black rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
      >
        Login
      </button>
    </form>
  );
}

function SignupForm({
  handleSubmit,
  signupUser,
  register,
  showPassword,
  togglePasswordVisibility,
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(signupUser)}
      autoComplete="on"
    >
      {/* Username Input */}
      <div className="relative">
        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          {...register("username")}
        />
      </div>

      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          className="w-full pl-10 pr-3 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          {...register("email")}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          className="w-full pl-10 pr-10 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          {...register("password")}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeClosed /> : <Eye />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 mb-4 bg-green-500 text-black rounded hover:bg-green-600 hover:scale-[1.05] transition cursor-pointer"
      >
        Sign Up
      </button>
    </form>
  );
}

function Alert({ alert, showAlert }) {
  return (
    <>
      {alert.show && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{alert.message}</span>
          <button
            onClick={() => showAlert({ message: "", show: false })}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

function SignupAlert({ alert, showAlert }) {
    return (
        <>
            {alert.show && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alert.message}</span>
                    <button
                        onClick={() => showAlert({ message: "", show: false })}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
