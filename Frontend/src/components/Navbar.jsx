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
        const uniqueCategories = [
          ...new Set(response.data.map((item) => item.productCategory)),
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
          <div
            className="dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <button className="dropdown-btn">Categories ▼</button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${category}`}
                    className="dropdown-item"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
