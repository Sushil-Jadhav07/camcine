import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services';
import { usePlayerStore } from '@/store';

export function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openPlayer, currentContent, isPlayerOpen } = usePlayerStore();

  const { data: content } = useQuery({
    queryKey: ['content', id],
    queryFn: () => contentService.getContentById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (content && !isPlayerOpen) {
      openPlayer(content);
    }
  }, [content, isPlayerOpen, openPlayer]);

  useEffect(() => {
    if (!isPlayerOpen && currentContent) {
      navigate(-1);
    }
  }, [isPlayerOpen, currentContent, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-camcine-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-camcine-text-secondary">Loading player...</p>
      </div>
    </div>
  );
}
