import React, { useEffect } from 'react';
import { useTagStore } from '../store/tagStore';
import { useAuthStore } from '../store/authStore';
import { PlusIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
export const TagsPage = () => {
  const {
    tags,
    fetchTags,
    followTag,
    unfollowTag,
    isLoading
  } = useTagStore();
  const {
    isAuthenticated
  } = useAuthStore();
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  const handleFollowTag = async (tagId: string, isFollowing: boolean) => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow tags');
      return;
    }
    try {
      if (isFollowing) {
        await unfollowTag(tagId);
        toast.success('Tag unfollowed');
      } else {
        await followTag(tagId);
        toast.success('Tag followed');
      }
    } catch (error) {
      toast.error('Failed to update tag');
    }
  };
  return <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <div className="relative">
          <input type="text" placeholder="Filter tags..." className="bg-background-medium bg-opacity-50 border border-white/10 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <p className="text-text-muted mb-6">
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </p>
      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-6 bg-background-dark rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-background-dark rounded w-full mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-background-dark rounded w-1/4"></div>
                <div className="h-8 w-8 bg-background-dark rounded-full"></div>
              </div>
            </div>)}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map(tag => <div key={tag.id} className="glass-card p-4 hover:shadow-glow transition-shadow duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-primary">
                  {tag.name}
                </h3>
                <span className="text-sm text-text-muted">
                  {tag.count} questions
                </span>
              </div>
              <p className="text-sm text-text-muted mb-4">
                {tag.description || `Questions related to ${tag.name}`}
              </p>
              <div className="flex justify-between items-center">
                <button onClick={() => handleFollowTag(tag.id, tag.isFollowing || false)} disabled={!isAuthenticated} className={`text-xs flex items-center px-3 py-1 rounded-full transition-colors ${tag.isFollowing ? 'bg-primary text-white' : 'bg-background-dark hover:bg-primary/20 text-text-light'} ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {tag.isFollowing ? <>
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Following
                    </> : <>
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Follow
                    </>}
                </button>
              </div>
            </div>)}
        </div>}
    </div>;
};