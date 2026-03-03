import React, { useEffect, useState } from "react";
import "./Admin.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  /* ===========================
     FETCH DATA
  ============================ */

  const fetchPosts = async (city = "") => {
    const res = await fetch(
      `${API_BASE}/posts${city ? `?city=${city}` : ""}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const fetchCityStats = async () => {
    const res = await fetch(`${API_BASE}/posts-by-city`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCityStats(data || []);
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
    fetchCityStats();
  }, []);

  /* ===========================
     DELETE FUNCTIONS
  ============================ */

  const deletePost = async (id) => {
    await fetch(`${API_BASE}/deletePost/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts(selectedCity);
    fetchCityStats();
  };

  const deleteUser = async (id) => {
    await fetch(`${API_BASE}/deleteUser/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
    fetchPosts();
    fetchCityStats();
  };

  const handleCityFilter = () => {
    fetchPosts(selectedCity.trim().toLowerCase());
  };

  const totalPosts = posts.length;
  const totalUsers = users.length;
  const totalCities = cityStats.length;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p>{totalPosts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Cities</h3>
          <p>{totalCities}</p>
        </div>
      </div>

      {/* City Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by city..."
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        />
        <button onClick={handleCityFilter}>Apply</button>
      </div>

      {/* POSTS TABLE */}
      <div className="table-section">
        <h2>Posts Management</h2>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>User</th>
              <th>Text</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                <td>{post.city}</td>
                <td>{post.userName?.split("@")[0]}</td>
                <td>{post.text}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USERS TABLE */}
      <div className="table-section">
        <h2>Users Management</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>City</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email?.split("@")[0]}</td>
                <td>{user.location}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;