"use client";

import React, { useState, useEffect } from "react";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Post {
  id: string;
  content: string;
  likes: number;
  hasLiked: boolean;
  createdAt: string;
}

export default function TreeHolePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await api.treeHole.getPosts();
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("加载失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("内容不能为空");
      return;
    }

    if (newPostContent.length > 300) {
      toast.error("内容不能超过300字");
      return;
    }

    setPosting(true);
    try {
      await api.treeHole.createPost({ content: newPostContent });
      toast.success("发布成功");
      setNewPostContent("");
      setShowCreateModal(false);
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("发布失败，请稍后再试");
    } finally {
      setPosting(false);
    }
  };

  // Toggle like
  const handleLike = async (postId: string) => {
    try {
      const response = await api.treeHole.toggleLike(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: response.data.data.likes, hasLiked: response.data.data.hasLiked }
          : post
      ));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("操作失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-30">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">树洞</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">匿名分享你的心声</p>
      </div>

      {/* Posts List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            还没有人分享，来做第一个吧
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${
                    post.hasLiked 
                      ? "bg-red-50 text-red-600" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Heart 
                    size={14} 
                    className={post.hasLiked ? "fill-current" : ""}
                  />
                  {post.likes > 0 && <span>{post.likes}</span>}
                </button>
                
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), { 
                    addSuffix: true, 
                    locale: zhCN 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
            <h2 className="text-base font-bold text-gray-800 mb-3">分享到树洞</h2>
            
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="说点什么吧...（匿名发布）"
              className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
              maxLength={300}
            />
            
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-xs text-gray-500">
                {newPostContent.length}/300
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1 py-2 text-sm"
              >
                取消
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={posting || !newPostContent.trim()}
                className="flex-1 py-2 text-sm bg-indigo-600 hover:bg-indigo-700"
              >
                {posting ? "发布中..." : "发布"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}