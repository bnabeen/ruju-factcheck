import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface VideoUrl {
  id: string;
  url: string;
  status?: number;
}

const VideoLinkPage: React.FC = () => {
  const [videoUrls, setVideoUrls] = useState<VideoUrl[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoUrls();
  }, []);

  const fetchVideoUrls = async () => {
    setLoading(true);
    try {
      const data = await api.getVideoUrls();
      setVideoUrls(data);
    } catch (error) {
      console.error('Failed to fetch video URLs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      await api.addVideoUrl(newUrl.trim());
      setNewUrl('');
      await fetchVideoUrls();
    } catch (error) {
      alert('Failed to add video URL');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video URL?')) return;
    setDeleting(id);
    try {
      await api.deleteVideoUrl(id);
      await fetchVideoUrls();
    } catch (error) {
      alert('Failed to delete video URL');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8">Video URL Manager</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            className="border px-3 py-2 rounded w-full"
            placeholder="Enter YouTube or video URL"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-ruju-red text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition"
            disabled={saving || !newUrl.trim()}
          >
            {saving ? 'Saving...' : 'Add URL'}
          </button>
        </div>

        {videoUrls.length === 0 && <div className="text-black/60">No video URLs added yet.</div>}

        {videoUrls.length > 0 && (
          <div>
            <div className="mb-4">
              <span className="font-bold text-black">Latest (Main) Video:</span>
              <div className="flex items-center gap-2 mt-2 p-2 bg-black/5 rounded-lg">
                <span className="truncate flex-1">{videoUrls[0].url}</span>
                <button
                  onClick={() => handleDelete(videoUrls[0].id)}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  disabled={deleting === videoUrls[0].id}
                >
                  {deleting === videoUrls[0].id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            {videoUrls.length > 1 && (
              <div>
                <span className="font-bold text-black">Side Videos:</span>
                <ul className="mt-2 space-y-2">
                  {videoUrls.slice(1).map((v) => (
                    <li key={v.id} className="flex items-center gap-2 p-2 bg-black/5 rounded-lg">
                      <span className="truncate flex-1">{v.url}</span>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        disabled={deleting === v.id}
                      >
                        {deleting === v.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLinkPage;