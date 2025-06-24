import React from "react";
import { Card } from "@/components/ui/card";
import styles from "./FeaturesSection.module.css";

const FeaturesSection: React.FC = () => (
  <section className={styles.featuresSection}>
    <div className={styles.featuresGrid}>
      {[1, 2].map((feature) => (
        <div key={feature} className={styles.featureCard}>
          <h2 className={styles.featureTitle}>Feature {feature}</h2>
          <p className={styles.featureDescription}>Details about this feature.</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;