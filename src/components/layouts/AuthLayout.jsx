import "@lottiefiles/lottie-player";
import authAnimation from "../../assets/authAnimation.json";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex ">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-xl font-medium text-black">Task Manager</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[('/bg-img.png)]">
        <lottie-player
          src={JSON.stringify(authAnimation)}
          autoplay
          loop
          class="w-64 lg:w-[90%] mx-auto"
        ></lottie-player>
      </div>
    </div>
  );
};

export default AuthLayout;
