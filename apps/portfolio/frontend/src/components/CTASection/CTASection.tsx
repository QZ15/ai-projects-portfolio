import React from "react";
import { Button } from "../ui/button";
import styles from "./CTASection.module.css";

const CTASection: React.FC = () => (
  <section className={styles.ctaSection}>
    <h2 className={styles.ctaTitle}>Ready to Start?</h2>
    <button className={styles.ctaButton}>Contact Us</button>
  </section>
);

export default CTASection;
