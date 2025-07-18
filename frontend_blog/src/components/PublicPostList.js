import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import Pagination from './Pagination';

function PublicPostList() {
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
    sort_by: ''
  });

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      
      // Add filters to params
      if (filters.title && filters.title.length >= 3) params.title = filters.title;
      if (filters.sort_by) params.sort_by = filters.sort_by;
      
      const response = await postsAPI.getPublishedPosts(params);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({ title: '', sort_by: '' });
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Published Posts</h1>
        <p className="text-gray-600">Browse our latest published blog posts.</p>
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
          <p className="text-gray-500 text-lg">No published posts available yet.</p>
          <p className="text-gray-400 mt-2">Check back later for new content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <Link to={`/posts/${post.id}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.body}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      By {post.user?.name || post.user?.email}
                    </span>
                    <span>
                      {new Date(post.inserted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination
        currentPage={meta.page_number}
        totalPages={meta.total_pages}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}

export default PublicPostList;
