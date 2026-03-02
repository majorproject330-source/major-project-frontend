import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Cityfeed.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/cityFeed`;
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const Cityfeed = () => {
  const [posts, setPosts] = useState([]);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const fetchPosts = async (cityName = "") => {
    try {
      const res = await fetch(
        `${API_BASE}/getPosts${cityName ? `?city=${cityName}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setPosts(data.posts || []);
      setCity(data.city || "");
    } catch (err) {
      console.error("Error fetching posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCitySearch = () => {
    fetchPosts(selectedCity);
  };

  // ✅ Only allow images
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      await fetch(`${API_BASE}/createPost`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setText("");
      setImage(null);
      setPreview(null);
      setShowModal(false);
      fetchPosts(city);
    } catch (err) {
      console.error("Error creating post");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/deletePost/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="cityfeed-container">

      {/* Header */}
      <div className="cityfeed-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h2>{city ? `${city.toUpperCase()} PUBLIC FEED` : "CITY FEED"}</h2>
      </div>

      {/* City Search */}
      <div className="city-search">
        <input
          type="text"
          placeholder="Search city..."
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        />
        <button className="search-button" onClick={handleCitySearch}>Search</button>
      </div>

      {/* Posts */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            🚫 No posts available in this city.
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
               <span className="username">
  {post.userName.split("@")[0]}
</span>
                <span className="time">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>

              {post.text && <p className="post-text">{post.text}</p>}

              {post.imageUrl && (
                <img
                  src={`${BASE_URL}${post.imageUrl}`}
                  alt="post"
                  className="post-image"
                />
              )}

              {post.userId?.toString() === userId?.toString() && (
                <div className="post-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Button */}
      <button className="floating-btn" onClick={() => setShowModal(true)}>
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Post</h3>

            <textarea
              placeholder="What's happening in your city?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <label className="upload-btn">
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>

            {preview && (
              <img src={preview} alt="preview" className="preview-image" />
            )}

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="post-btn" onClick={handleCreatePost}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cityfeed;