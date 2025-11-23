import { useEffect, useState } from "react";
import { api } from "../api";

const HealthCheck = () => {
  const [health, setHealth] = useState<any | null>(null);

  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch((e) => setHealth({ error: e.data?.error || e.message }));
  }, []);

  return (
    <div>
      <h2>Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
};
export default HealthCheck;
