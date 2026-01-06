export default function NewsletterSignup() {
  return (
    <>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Get 10% Off Your First Order
      </h2>
      <p className="text-lg mb-8 opacity-90">
        Join our list for exclusive offers and new arrivals
      </p>
      <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500"
          required
        />
        <button
          type="submit"
          className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Subscribe
        </button>
      </form>
    </>
  );
}