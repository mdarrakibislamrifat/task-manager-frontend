import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserProviderContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserProviderContext);
  const navigate = useNavigate();

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName || !validateEmail(email) || !password) {
      setError("Please fill all fields correctly.");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes?.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        // ১. সবার আগে টোকেন সেভ করুন
        localStorage.setItem("token", token);

        // ২. কনটেক্সট আপডেট করুন
        updateUser(response.data);

        // ৩. কনসোলে চেক করুন রোলটি কী আসছে (ডিবাগিং এর জন্য)
        console.log("User Role from Response:", role);

        // ৪. ছোট একটি ডিলে দিন যাতে স্টেট এবং স্টোরেজ সিঙ্ক হওয়ার সময় পায়
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else if (role === "member") {
            navigate("/user/dashboard");
          } else {
            // যদি রোল না মেলে তাহলেও যেন কোথাও যায়
            navigate("/user/dashboard");
          }
        }, 500);
      }
    } catch (err) {
      console.error("Signup Error Details:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center ">
        <h3 className="text-2xl font-bold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-2 mb-6">
          Join us today by entering your details below
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />

            <div className="flex flex-col gap-2">
              <Input
                value={adminInviteToken}
                onChange={(e) => setAdminInviteToken(e.target.value)}
                label="Need Admin access? Please provide a valid 6-digit invite token."
                placeholder="6 Digit Code"
                type="password"
                className="w-full"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            SIGN UP
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
