'use client';
import React, { useState } from 'react';
export default function Page() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is this platform about?",
      answer: "This is a modern web application built with Next.js and React. It provides various features to help users manage their content, feedback, and more as we continue to develop it."
    },
    {
      question: "How can I submit feedback?",
      answer: "The feedback section is currently under development. We're working hard to bring you a way to share your thoughts and suggestions. Check back soon!"
    },
    {
      question: "Is this app free to use?",
      answer: "Yes! The core features are completely free. We may introduce premium options in the future for advanced functionality."
    },
    {
      question: "Can I use this on mobile devices?",
      answer: "Absolutely. The site is fully responsive and works great on phones, tablets, and desktops."
    },
    {
      question: "How do I report a bug or issue?",
      answer: "While our dedicated feedback system is coming soon, you can temporarily reach out via our contact form or email support (if available in your version)."
    },
    {
      question: "When will new features be added?",
      answer: "We're actively developing new features, including the full feedback system. Stay tuned for updates – exciting things are coming soon!"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Find answers to common questions. Can&apos;t find what you&apos;re looking for? Feedback is coming soon!
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`h-6 w-6 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            More questions? The full feedback system is <span className="font-semibold text-indigo-600">coming soon!</span>
          </p>
        </div>
      </div>
    </div>
  );
}