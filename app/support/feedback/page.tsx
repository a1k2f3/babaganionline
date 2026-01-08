'use client';
import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Feedback</h1>
        
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            
            <p className="text-xl font-medium text-gray-700 mb-2">
              There is no new feedback here.
            </p>
            
            <p className="text-lg text-gray-500">
              Coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}