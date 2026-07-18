import StatCard from "../common/StatCard";

const DashboardStats = ({ users }) => {
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Total Users"
        value={totalUsers}
      />

      <StatCard
        title="Active Users"
        value={activeUsers}
        color="green"
      />

      <StatCard
        title="Inactive Users"
        value={inactiveUsers}
        color="red"
      />
    </div>
  );
};

export default DashboardStats;