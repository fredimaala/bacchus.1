import React, { useState, useEffect } from "react";
import axios from "axios";
import BidForm from "./BidForm";

const AuctionList = ({ category }) => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [bids, setBids] = useState([]); // Store submitted bids

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = category
          ? `http://localhost:4000/auctions/${category}`
          : "http://localhost:4000/auctions";

        const response = await axios.get(url);
        setAuctions(response.data);
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
  

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {auctions.length === 0 && !error ? (
        <p>No auctions available.</p>
      ) : (
        auctions.map((auction) => (
          <div key={auction.productId} className="auction-item">
            <h2>{auction.productName}</h2>
            <p>Category: {auction.productCategory}</p>
            <p>Ends at: {new Date(auction.biddingEndDate).toLocaleString()}</p>
            <p>{auction.productDescription}</p>
            <BidForm productId={auction.productId} onBidSubmit={handleBidSubmit} />
          </div>
        ))
      )}
    </div>
  );
};

export default AuctionList;
