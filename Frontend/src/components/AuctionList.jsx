import React, { useState, useEffect } from "react";
import axios from "axios";
import BidForm from "./BidForm";



const AuctionList = ({ category }) => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        {currentAuctions.map((auction) => (
          <div key={auction.productId} className="auction-item">
            <h2>{auction.productName}</h2>
            <p>Category: {auction.productCategory}</p>
            <p>Ends at: {new Date(auction.biddingEndDate).toLocaleString()}</p>
            <p>{auction.productDescription}</p>
            <BidForm productId={auction.productId} onBidSubmit={handleBidSubmit} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default AuctionList;
