import { useEffect, useState } from "react";
import { getUsers } from "@/api/users";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <pre className="bg-gray-100 p-3 rounded">
          {JSON.stringify(users, null, 2)}
        </pre>
      )}
    </div>
  );
}
