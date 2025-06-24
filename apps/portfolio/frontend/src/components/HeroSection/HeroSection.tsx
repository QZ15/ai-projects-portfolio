import React from "react";
import { Button } from "@/components/ui/button";
import styles from "./HeroSection.module.css";

const HeroSection: React.FC = () => (
  <section className={styles.heroSection}>
    <h1 className={styles.heroTitle}>Welcome to Your Site</h1>
    <p className={styles.heroDescription}>A brief description of what you offer.</p>
    <button className={styles.heroButton}>Get Started</button>
  </section>
);

export default HeroSection;
