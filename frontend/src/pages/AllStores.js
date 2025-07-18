import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const AllStores = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({}); 
  const [averageRatings, setAverageRatings] = useState({}); 

  useEffect(() => {
    
    const fetchStores = async () => {
      const res = await axios.get('/stores/stores');
      setStores(res.data);
    };
    fetchStores();

    
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
        
      }
    };
    fetchUserRatings();
  }, []);

  const handleRating = async (storeId, rating) => {
    try {
      console.log('Submitting rating:', { storeId, rating }); 
      await axios.post('/ratings/submit', {
        store_id: storeId,
        rating: rating
      });
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      
      const res = await axios.get('/ratings/');
      const avgs = {};
      res.data.forEach(item => {
        avgs[item.store_id] = item.average_rating;
      });
      setAverageRatings(avgs);
      alert('Rating submitted/updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">All Stores</h1>
      {stores.map(store => (
        <div key={store.id} className="store-card">
          <h2 className="store-name">{store.name}</h2>
          <p>{store.description}</p>
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
        `}
      </style>
    </div>
  );
};

export default AllStores;
