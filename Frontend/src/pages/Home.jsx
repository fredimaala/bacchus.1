import React, { useState } from "react";
import AuctionList from "../components/AuctionList";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <h1>Welcome to Bacchus Auction</h1>
      <p1>Select a category from the menu or view all auctions below.</p1>

      {/* Auction List Component */}
      <AuctionList category={selectedCategory} />
    </div>
  );
};

export default Home;
