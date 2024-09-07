import UserGrowth from "./UsersGrowth";

const AdminStats = ({
  users
}:{
  users: any[];
}) => {
  return (
    <div className="flex w-full gap-2">
      <UserGrowth 
      users={users}
      />
    </div>
  );
};

export default AdminStats;
