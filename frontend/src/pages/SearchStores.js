import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const SearchStores = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [averageRatings, setAverageRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); 

  useEffect(() => {
    fetchUserRatings();
  }, []);

  const fetchUserRatings = async () => {
    try {
      const res = await axios.get('/ratings/');
      const ratings = {};
      const avgs = {};
      res.data.forEach(item => {
        ratings[item.store_id] = item.user_rating;
        avgs[item.store_id] = item.average_rating;
      });
      setUserRatings(ratings);
      setAverageRatings(avgs);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      
      const res = await axios.get('/stores/stores');
      setStores(res.data);
      return;
    }

    try {
      const res = await axios.get(`/stores/search?${searchType}=${encodeURIComponent(searchTerm)}`);
      setStores(res.data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search stores');
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await axios.post('/ratings/submit', {
        store_id: storeId,
        rating: rating
      });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      
      await fetchUserRatings();
      alert('Rating submitted/updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Search Stores</h1>
      
      <div className="search-section">
        <div className="search-controls">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type"
          >
            <option value="name">Search by Name</option>
            <option value="address">Search by Address</option>
          </select>
          <input
            type="text"
            placeholder={`Search stores by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>

      <div className="stores-list">
        {stores.map(store => (
          <div key={store.id} className="store-card">
            <h2 className="store-name">{store.name}</h2>
            <p><b>Address:</b> {store.address}</p>
            <p><b>Average Rating:</b> {averageRatings[store.id] || 'N/A'}</p>
            <p><b>Your Rating:</b> {userRatings[store.id] || 'Not rated'}</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRating(store.id, star)}
                  className={`star ${userRatings[store.id] >= star ? 'active' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && searchTerm && (
        <p className="no-results">No stores found matching your search.</p>
      )}

      <style>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .heading {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .search-section {
          margin-bottom: 30px;
        }
        .search-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .search-type {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .search-input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .search-button {
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .search-button:hover {
          background-color: #0056b3;
        }
        .store-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .store-name {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .stars {
          margin-top: 10px;
        }
        .star {
          font-size: 24px;
          color: gray;
          background: none;
          border: none;
          cursor: pointer;
          margin: 0 4px;
          transition: color 0.3s ease;
        }
        .star.active {
          color: gold;
        }
        .star:hover {
          color: orange;
        }
        .no-results {
          text-align: center;
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SearchStores; 