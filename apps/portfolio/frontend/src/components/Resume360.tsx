import React from 'react';
import { Link } from 'react-router-dom';

const Resume360: React.FC = () => {
  return (
    <div>
      <h1>Welcome to My Portfolio</h1>
      <p>Explore my projects, skills, and experience.</p>
      <div>
        <Link to="/devhub">Go to DevHub</Link>
        <Link to="/">Go to HomePage</Link>
      </div>
    </div>
  );
};

export default Resume360;
