export default function TrustBadges() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div>
        <h3 className="text-xl font-bold">Free Shipping</h3>
        <p className="text-gray-600 mt-2">On First Two Months orders </p>
      </div>
      <div>
        <h3 className="text-xl font-bold">30-Day Returns</h3>
        <p className="text-gray-600 mt-2">Hassle-free returns</p>
      </div>
      <div>
        <h3 className="text-xl font-bold">Secure Checkout</h3>
        <p className="text-gray-600 mt-2">100% protected payments</p>
      </div>
    </div>
  );
}