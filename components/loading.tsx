// components/ui/Loader.tsx

import React from 'react';

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <svg
      className="animate-spin h-12 w-12 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
      ></path>
    </svg>
  </div>
);

export default Loader;
