
import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold">Book Management API</h1>
        <p className="text-blue-100 mt-2">Node.js &amp; TypeScript Interview Project</p>
      </div>
    </header>
  );
};

export default Header;
