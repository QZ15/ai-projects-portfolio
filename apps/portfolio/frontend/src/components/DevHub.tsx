import React from 'react';

const DevHub: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">DevHub - Project Showcase</h1>
      <p className="text-lg mt-2">Browse my projects and explore the tech stack I’ve worked with.</p>
      <div className="mt-6 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold">Tech Stack Explorer</h2>
          <p>Filter projects by technology.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Live Project Showcase</h2>
          <p>Interactive demos of my projects.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Code Snippet Generator</h2>
          <p>Highlighted code snippets from key projects.</p>
        </section>
      </div>
    </div>
  );
  
};

export default DevHub;
