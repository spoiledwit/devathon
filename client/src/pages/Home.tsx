import useAuthStore from "@/store/authStore";

const Home = () => {

  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-center">
        <div className="w-full p-20">
          {user ? (
            <div>
              <h1 className="font-medium text-3xl text-violet-950 mb-1">
                Weclome {user.name}!
              </h1>
              <h2 className="text-md text-violet-950 mb-6">
                Your email is: {user.email}!
              </h2>
            </div>
          ) : (
            <h1 className="font-medium text-3xl text-violet-950 mb-6">
              Login first.
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
