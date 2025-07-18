import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import Pagination from './Pagination';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({
    page_size: 10,
    page_number: 1,
    total_entries: 0,
    total_pages: 1
  });
  const [filters, setFilters] = useState({
    title: '',
    draft: '',
    sort_by: ''
  });

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      
      // Add filters to params
      if (filters.title && filters.title.length >= 3) params.title = filters.title;
      if (filters.draft !== '') params.draft = filters.draft === 'true';
      if (filters.sort_by) params.sort_by = filters.sort_by;
      
      const response = await postsAPI.getAllPosts(params);
      setPosts(response.data.data);
      setMeta(response.data.meta);
      setError(null);
    } catch (err) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(postId);
        // Refresh the current page to update the list
        fetchPosts(currentPage);
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Error deleting post');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({ title: '', draft: '', sort_by: '' });
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading posts...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h1>
        <p className="text-gray-600">Discover and manage all blog posts.</p>
        {meta.total_entries > 0 && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span>Showing {posts.length} of {meta.total_entries} posts</span>
            <span className="mx-2">•</span>
            <span>Page {meta.page_number} of {meta.total_pages}</span>
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-0">
            <label htmlFor="title-filter" className="sr-only">Search by title</label>
            <input
              id="title-filter"
              type="text"
              placeholder="Search posts by title (min 3 characters)..."
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="status-filter" className="sr-only">Filter by status</label>
              <select
                id="status-filter"
                value={filters.draft}
                onChange={(e) => handleFilterChange('draft', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="false">Published</option>
                <option value="true">Draft</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-filter" className="sr-only">Sort by</label>
              <select
                id="sort-filter"
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sort by Date (Newest)</option>
                <option value="created_at">Date (Oldest)</option>
                <option value="title">Title (A-Z)</option>
                <option value="title_desc">Title (Z-A)</option>
                <option value="draft">Status (Published First)</option>
                <option value="draft_desc">Status (Draft First)</option>
              </select>
            </div>
            
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg">No posts available yet.</p>
          <p className="text-gray-400 mt-2">Be the first to create a post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
              <div className="col-span-5">Post</div>
              <div className="col-span-2">Author</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>
          
          {/* Posts List */}
          <div className="divide-y divide-gray-200">
            {posts.map(post => (
              <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Post Title and Content */}
                  <div className="col-span-5">
                    <Link
                      to={`/posts/${post.id}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {post.body}
                      </p>
                    </Link>
                  </div>
                  
                  {/* Author */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">
                      {post.user?.name || post.user?.email}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      {new Date(post.inserted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1">
                    {post.draft ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-2 flex justify-end space-x-2">
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      <Pagination
        currentPage={meta.page_number}
        totalPages={meta.total_pages}
        onPageChange={handlePageChange}
        loading={loading}
      />
      
      <div className="mt-8 text-center">
        <Link 
          to="/create-post" 
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Create New Post +
        </Link>
      </div>
    </div>
  );
}

export default PostList;
