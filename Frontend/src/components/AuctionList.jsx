import React, { useState, useEffect } from "react";
import axios from "axios";
import BidForm from "./BidForm";

const AuctionList = ({ category }) => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = category
          ? `http://localhost:4000/auctions/${category}`
          : "http://localhost:4000/auctions";

        const response = await axios.get(url);
        // Sort by soonest ending auction first
        const sortedAuctions = response.data.sort(
          (a, b) => new Date(a.biddingEndDate) - new Date(b.biddingEndDate)
        );
        setAuctions(sortedAuctions);
      } catch (err) {
        console.error("Error fetching auctions:", err);
        setError("Could not load auctions. Please try again later.");
      }
    };

    fetchAuctions();
  }, [category]);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns = {};
      const filteredAuctions = auctions.filter((auction) => {
        const timeLeft = new Date(auction.biddingEndDate) - new Date();
        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newCountdowns[auction.productId] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          return true; // Keep auction
        }
        return false; // Remove expired auction
      });

      setCountdowns(newCountdowns);
      setAuctions(filteredAuctions);
    };

    // Update countdowns every second
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [auctions]);

  const handleBidSubmit = async (productId, bidderName, bidAmount) => {
    try {
      await axios.post("http://localhost:4000/bids", {
        productId,
        bidderName,
        bidAmount,
      });
      alert("Bid submitted successfully!");
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Failed to submit bid. Please try again.");
    }
  };

  // Pagination Logic
  const indexOfLastAuction = currentPage * itemsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - itemsPerPage;
  const currentAuctions = auctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(auctions.length / itemsPerPage);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="auction-container">
        {currentAuctions.length > 0 ? (
          currentAuctions.map((auction) => (
            <div key={auction.productId} className="auction-item">
              <h2>{auction.productName}</h2>
              <p>Category: {auction.productCategory}</p>
              <p>Time Left: {countdowns[auction.productId] || "Calculating..."}</p>
              <p>{auction.productDescription}</p>
              <BidForm productId={auction.productId} onBidSubmit={handleBidSubmit} />
            </div>
          ))
        ) : (
          <p>No active auctions available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;
