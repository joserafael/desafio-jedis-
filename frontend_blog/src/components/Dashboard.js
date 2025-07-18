import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  const [recentPosts, setRecentPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recentPostsResponse, myPostsResponse] = await Promise.all([
        postsAPI.getPublishedPosts({ page: 1, page_size: 5 }),
        postsAPI.getMyPosts({ page: 1, page_size: 5 })
      ]);
      
      // Get recent published posts (first 5 from the API)
      const recentPosts = recentPostsResponse.data.data;
      setRecentPosts(recentPosts);
      
      setMyPosts(myPostsResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || user?.email}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your blog today.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
            <span className="text-sm text-gray-500">{recentPosts.length} posts</span>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map(post => (
                <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">
                    {post.body?.substring(0, 100)}...
                  </p>
                  <small className="text-gray-500">
                    By {post.user?.name || post.user?.email}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent posts available.</p>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <Link 
              to="/posts" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Posts →
            </Link>
          </div>
        </div>
        
        {/* My Posts Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
            <span className="text-sm text-gray-500">{myPosts.length} posts</span>
          </div>
          
          {myPosts.length > 0 ? (
            <div className="space-y-4">
              {myPosts.slice(0, 5).map(post => (
                <div key={post.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">
                    {post.body?.substring(0, 100)}...
                  </p>
                  <small className="text-gray-500">
                    Created: {new Date(post.inserted_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
              <div className="text-6xl mb-4">📝</div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t">
            <Link 
              to="/create-post" 
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create New Post +
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
