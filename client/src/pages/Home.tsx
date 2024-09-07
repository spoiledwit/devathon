import useAuthStore from "@/store/authStore";
import Events from "./Events/Events";

const Home = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="w-full p-5 px-20">
          {user ? (
            <Events />
          ) : (
            <h1 className="font-medium text-3xl text-black mb-6">
              Login first.
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
