import { useState } from "react";
import { shareStoryService } from "../service/StoryService"; // Confirm this service endpoint path matches your folder tree structure
import toast from "react-hot-toast";

export default function ShareModal({ storyId, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await shareStoryService(storyId, email.trim());
      toast.success(`Story shared with ${email}`);
      setEmail("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#202020] border border-[#2e2e2e] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-base">Share story</h2>
            <p className="text-[#9b9b9b] text-xs mt-0.5">
              They'll get view-only access
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4">
          <div>
            <label className="block text-[#9b9b9b] text-xs font-semibold uppercase tracking-widest mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collaborator@example.com"
              required
              autoFocus
              className="w-full bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg px-4 py-3 text-[#e8e8e8] text-sm placeholder-[#4d4d4d] focus:outline-none focus:border-[#606060] transition-all"
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-[#3d3d3d] hover:border-[#555] text-[#9b9b9b] hover:text-white font-medium py-2.5 rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 bg-white hover:bg-[#e8e8e8] text-black font-semibold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
