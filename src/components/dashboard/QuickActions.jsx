import { Link } from "react-router-dom";

import Button from "../common/Button";

const QuickActions = () => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold">
        Quick Actions
      </h2>

      <p className="mt-2 text-slate-500">
        Manage your application users.
      </p>

      <div className="mt-6 flex gap-4">
        <Link to="/users">
          <Button>
            View Users
          </Button>
        </Link>

        <Link to="/users/new">
          <Button variant="secondary">
            Add User
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;