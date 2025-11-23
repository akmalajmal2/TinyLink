import { useEffect, useState } from "react";
import { api } from "../api";

import { Link } from "react-router-dom";

const Table = ({ links, setLinks }: { links: linkProps[]; setLinks: any }) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchData(queryString = "") {
    setLoading(true);
    try {
      const data = await api.list(queryString);
      setLinks(data.links || []);
    } catch (e: any) {
      alert(e.data?.error || e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await fetchData(query);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this link?")) return;
    try {
      await api.delete(id);
      setLinks((prev: linkProps[]) =>
        prev.filter((l: linkProps) => l.id !== id)
      );
    } catch (e: any) {
      alert(e.data?.error || e.message || "Delete failed");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="mt-5">
      <div className="flex items-center mb-3">
        <h2 className="text-3xl font-semibold text-center mt-3 ml-auto">
          Links
        </h2>
        <form onSubmit={handleSearch} className="ml-auto flex gap-3">
          <input
            placeholder="Search code or URL"
            className="outline-2 outline-gray-400 rounded-lg px-3 py-1 text-lg focus:outline-gray-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 pt-1 pb-2 rounded-sm bg-cyan-600 text-white text-lg font-medium leading-none cursor-pointer hover:opacity-90 hover:scale-105 duration-300 "
          >
            Search
          </button>
          <button
            className="px-3 pt-1 pb-2 rounded-sm bg-gray-400 text-white font-medium leading-none cursor-pointer text-lg hover:bg-red-400 hover:scale-105 duration-300"
            type="button"
            onClick={() => {
              setQuery("");
              fetchData();
            }}
          >
            Clear
          </button>
        </form>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full rounded-xl border border-gray-700 overflow-hidden ">
          <table className="bg-gray-100 w-full overflow-y-auto    border-collapse">
            <thead className="bg-indigo-200 [&>tr>th]:p-2 [&>tr>th]:text-center">
              <tr className="p-2">
                <th>Code</th>
                <th>Short Code</th>
                <th>Target URL</th>
                <th>Total Clicks</th>
                <th>Last clicked time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:p-2 [&>tr>td]:text-center">
              {links?.map((link: linkProps) => (
                <tr key={link.id} className="even:bg-gray-200 ">
                  <td>
                    <Link to={`/code/${encodeURIComponent(link.code)}`}>
                      {link.code}
                    </Link>
                  </td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_API_BASE}/${link.code}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {import.meta.env.VITE_API_BASE}/{link.code}
                    </a>
                  </td>
                  <td>
                    {" "}
                    <a href={link.target_url} target="_blank" rel="noreferrer">
                      {link.target_url}
                    </a>
                  </td>
                  <td>{link.clicks}</td>
                  <td>
                    {link.last_clicked
                      ? new Date(link.last_clicked).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="bg-red-400 hover:scale-105 hover:opacity-75 px-3 py-2 rounded-lg font-medium text-gray-100 cursor-pointer"
                      onClick={() => handleDelete(link.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={6}>No links</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
export default Table;
