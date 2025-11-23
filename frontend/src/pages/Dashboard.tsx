import { useState } from "react";
import Table from "../components/Table";
import CreateShortUrl from "../components/CreateShortUrl";

const Dashboard = () => {
  const [links, setLinks] = useState<linkProps[]>([]);

  const handleCreate = (link: linkProps) => {
    setLinks((prev) => [link, ...prev]);
  };

  return (
    <section className="w-full px-4">
      <CreateShortUrl onCreate={handleCreate} />
      <Table links={links} setLinks={setLinks} />
    </section>
  );
};
export default Dashboard;
