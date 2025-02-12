import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/auctions");

        // Filter out auctions that have already ended
        const activeAuctions = response.data.filter(
          (auction) => new Date(auction.biddingEndDate) > new Date()
        );

        // Get unique categories from active auctions only
        const uniqueCategories = [
          ...new Set(activeAuctions.map((item) => item.productCategory)),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-link">All Auctions</Link>

          {/* Dropdown Menu */}
          <div className="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <button className="dropdown-btn">Categories ▼</button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      className="dropdown-item"
                    >
                      {category}
                    </Link>
                  ))
                ) : (
                  <p className="dropdown-item">No active categories</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
