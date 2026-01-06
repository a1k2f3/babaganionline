'use client';
import React from 'react';
export default function Page() {
  const handleWhatsAppRequest = () => {
    const phoneNumber = '+923117687149'; // Replace with your actual WhatsApp business number (international format, no + in URL)
    const message = encodeURIComponent(
      "Hi! I'm interested in early access to the seller features. Please add me to the waitlist or let me know how to get started. Thank you!"
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8">
          Start Selling
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-12 max-w-2xl mx-auto">
          <svg
            className="mx-auto h-20 w-20 text-indigo-500 mb-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p className="text-2xl font-semibold text-gray-800 mb-4">
            Seller features are coming soon!
          </p>

          <p className="text-lg text-gray-600 mb-8">
            We&apos;re working hard to bring you a powerful and easy-to-use selling platform.
          </p>

          <div className="bg-indigo-50 border-2 border-indigo-200 border-dashed rounded-xl p-8">
            <p className="text-xl font-medium text-indigo-900 mb-4">
              Early access on request
            </p>
            <p className="text-gray-700 mb-6">
              Be among the first to start selling when we launch. Send us a message on WhatsApp to join the waitlist!
            </p>
            
            <button
              onClick={handleWhatsAppRequest}
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="mr-3 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.967.967-3.734-.215-.361a9.86 9.86 0 01-1.378-5.021 9.97 9.97 0 0110.002-9.999 9.97 9.97 0 019.999 10.002 9.97 9.97 0 01-9.999 9.999z"/>
              </svg>
              Message on WhatsApp
            </button>
          </div>

          <p className="mt-10 text-sm text-gray-500">
            We&apos;ll reply as soon as possible and notify you when seller registration opens.
          </p>
        </div>
      </div>
    </div>
  );
}