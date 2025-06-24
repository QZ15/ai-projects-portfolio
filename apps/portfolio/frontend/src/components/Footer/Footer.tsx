import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    // <footer className={styles.footer}>
    //   <div className={styles.footerContainer}>
    //     <div className={styles.logo}>YourLogo</div>
    //     <div className={styles.links}>
    //       <a href="/" className={styles.link}>Home</a>
    //       <a href="/about" className={styles.link}>About</a>
    //       <a href="/services" className={styles.link}>Services</a>
    //       <a href="/contact" className={styles.link}>Contact</a>
    //     </div>
    //     <div className={styles.social}>
    //       <a href="https://twitter.com" className={styles.socialIcon}>Twitter</a>
    //       <a href="https://facebook.com" className={styles.socialIcon}>Facebook</a>
    //       <a href="https://linkedin.com" className={styles.socialIcon}>LinkedIn</a>
    //     </div>
    //     <p className={styles.copyright}>
    //       &copy; {new Date().getFullYear()} Your Company. All rights reserved.
    //     </p>
    //   </div>
    // </footer>

    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <img
              alt="Logo Preview"
              src="https://tailwind-generator.b-cdn.net/favicon.png"
              width="120"
            />
            <div className={styles.companyName}>Your Company</div>
          </div>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Twitter" className={styles.socialIcon}>
              {/* SVG Icon */}
            </a>
            <a href="#" aria-label="YouTube" className={styles.socialIcon}>
              {/* SVG Icon */}
            </a>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}>
              {/* SVG Icon */}
            </a>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.linkGroups}>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Explore</div>
              <a href="#features" className={styles.link}>Features</a>
              <a href="#docs" className={styles.link}>Docs</a>
              <a href="#pricing" className={styles.link}>Pricing</a>
              <a href="#security" className={styles.link}>Security</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Company</div>
              <a href="#about" className={styles.link}>About Us</a>
              <a href="#contact" className={styles.link}>Contact</a>
              <a href="#support" className={styles.link}>Support</a>
              <a href="#news" className={styles.link}>News</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Legal</div>
              <a href="#imprint" className={styles.link}>Imprint</a>
              <a href="#privacy" className={styles.link}>Privacy Policy</a>
              <a href="#terms" className={styles.link}>Terms of Use</a>
            </div>
          </div>
          <div className={styles.newsletter}>
            <div className={styles.linkGroupTitle}>Newsletter</div>
            <p className={styles.newsletterText}>Subscribe to our newsletter.</p>
            <form className={styles.form}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={styles.input}
                autoComplete="off"
                required
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.copyright}>© 2024 Your Company - All rights reserved.</div>
    </footer>
  );
};

export default Footer;
