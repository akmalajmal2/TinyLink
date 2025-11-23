import { useState } from "react";
import { api } from "../api";

const CreateShortUrl = ({ onCreate }: { onCreate: (link: any) => void }) => {
  const [url, setUrl] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.create({
        target_url: url,
        custom_code: code || undefined,
      });
      onCreate(res.link);
      setUrl("");
      setCode("");
    } catch (err: any) {
      alert(err.data?.error || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" bg-blue-200 rounded-3xl p-4 border border-bg-blue-300/30 mt-7 text-black">
      <h2 className="text-2xl font-bold mb-2">Shorten a long link</h2>
      <p className="text-lg mb-5">No credit card required</p>
      <form onSubmit={handleSubmit}>
        <label className="font-semibold text-xl mb-2 block">
          Paste your long link here
        </label>
        <input
          value={url}
          required
          onChange={(e) => setUrl(e.target.value)}
          className="w-full outline-2 outline-gray-200 focus:outline-gray-500 rounded-lg px-3 py-2.5 text-2xl mb-5 bg-white"
          placeholder="https://example.com/my-long-url"
        />
        <div className="flex items-center gap-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className=" outline-2 outline-gray-200 focus:outline-gray-500 rounded-lg px-3 py-1.5 text-xl flex-1 bg-white"
            placeholder="custom short code (optional)"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0058dd] px-6 py-3 text-2xl text-white rounded-xl font-semibold cursor-pointer hover:opacity-70"
          >
            {loading ? "Submitting..." : "Get your link for free"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateShortUrl;
