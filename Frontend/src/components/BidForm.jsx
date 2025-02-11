import React, { useState } from "react";


const BidForm = ({ productId, onBidSubmit }) => {
  const [bidderName, setBidderName] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bidderName || !bidAmount) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    onBidSubmit(productId, bidderName, parseFloat(bidAmount));
    setBidderName("");
    setBidAmount("");
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Full Name"
        value={bidderName}
        onChange={(e) => setBidderName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Your Bid (€)"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />
      <button type="submit">Submit Bid</button>
    </form>
  );
};

export default BidForm;
