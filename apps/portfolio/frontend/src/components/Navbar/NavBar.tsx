import React from "react";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">YourLogo</a>
        </div>
      <div className="flex space-x-4">
        <a href="/devhub" className={styles.navbarLink}>DevHub</a>
        <a href="/resume360" className={styles.navbarLink}>Resume360</a>
        {/* Profile image linking to the profile page */}
        <a href="/profile" className={styles.profileLink}>
          <img
            src="https://via.placeholder.com/40" // Replace with your profile image URL
            alt="Profile"
            className={styles.profileImage}
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
