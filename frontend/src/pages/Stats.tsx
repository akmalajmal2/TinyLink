import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

const Stats = () => {
  const { code } = useParams();
  const [link, setLink] = useState<linkProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.stats(code!);
        setLink(response.link);
      } catch (e: any) {
        if (e.status === 404) setLink(null);
        else alert(e.data?.error || e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  if (loading) return <p>Loading…</p>;
  if (!link) return <p>Not found</p>;

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-2 bg-gray-200 max-w-3xl rounded-2xl border border-gray-500 p-4">
        <h2>
          <strong>Stats for</strong> <em>{link.code}</em>
        </h2>
        <p>
          <strong>Short URL: </strong>
          <em>
            <a
              href={`${window.location.origin}/${link.code}`}
              target="_blank"
              rel="noreferrer"
            >
              {window.location.origin}/{link.code}
            </a>
          </em>
        </p>
        <p>
          <strong>Target URL: </strong>
          <em>
            <a href={link.target_url} target="_blank" rel="noreferrer">
              {link.target_url}
            </a>
          </em>
        </p>
        <p>
          <strong>Clicks: </strong>
          <em>{link.clicks}</em>
        </p>
        <p>
          <strong>Created: </strong>
          <em>{new Date(link.created_at).toLocaleString()}</em>
        </p>
        <p>
          <strong>Last clicked: </strong>
          <em>
            {link.last_clicked
              ? new Date(link.last_clicked).toLocaleString()
              : "-"}
          </em>
        </p>
      </div>
    </section>
  );
};
export default Stats;
