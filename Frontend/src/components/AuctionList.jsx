import React, { useState, useEffect } from "react";
import axios from "axios";
import BidForm from "./BidForm";

const AuctionList = ({ category }) => {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const url = category
          ? `http://localhost:4000/auctions/${category}`
          : "http://localhost:4000/auctions";
        const response = await axios.get(url);
        setAuctions(response.data);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setError("Failed to load auctions. Please try again later.");
      }
    };

    fetchAuctions();
  }, [category]);

  const handleBid = async (productId, bidderName, bidAmount) => {
    try {
      const response = await axios.post(`http://localhost:4000/bids`, {
        productId,
        bidderName,
        bidAmount,
      });
      if (response.status === 200) {
        setMessage("Bid successfully submitted!");
        // Optionally refresh the auction list
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Bid submission failed:", err);
      setError("Failed to submit bid. Please try again.");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {auctions.length === 0 && !error ? (
        <p>No auctions available at the moment.</p>
      ) : (
        auctions.map((auction) => (
          <div key={auction.productId} className="auction-item">
            <h2>{auction.productName}</h2>
            <p>{auction.productCategory}</p>
            <p>Ends at: {new Date(auction.biddingEndDate).toLocaleString()}</p>
            <p>Description: {auction.productDescription}</p>

            {/* Bidding Form */}
            <BidForm
              productId={auction.productId}
              onBidSubmit={handleBid}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default AuctionList;
