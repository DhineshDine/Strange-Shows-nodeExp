import React from "react";

const SubscriptionPlans = () => {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold">BIGGER BOAT</h2>
      </div>
      
      {/* Subscription Card */}
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-3xl">
        <h3 className="text-2xl font-bold text-center mb-4">
          SELECT A SINGLE SEAT OR MULTI-SEAT PLAN
        </h3>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>Good for up to one regularly priced movie per day</li>
          <ul className="list-circle pl-6">
            <li>3D, 70mm, Dolby Atmos, and Big Show movies require a $1.99 fee per ticket</li>
            <li>Standard online convenience fees apply</li>
          </ul>
          <li>Save your seat the minute it goes on sale</li>
          <li>Subscription automatically renews each month until canceled</li>
        </ul>

        <p className="text-gray-600 italic text-center mb-4">
          For use at these locations: Austin, Charlottesville, Corpus Christi, Dallas/Fort Worth, Denver Area, El Paso, Houston, Indianapolis, Laredo, Lubbock, Northern Virginia, Omaha, Raleigh, San Antonio, Springfield, MO, St. Louis, Twin Cities, Winchester, Yonkers
        </p>
        <p className="text-gray-600 italic text-center mb-6">
          $10.00 ticket discount at all other Season Pass locations.
        </p>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {/* Single Seat Plan */}
          <div className="border p-6 rounded-lg shadow">
            <h4 className="text-xl font-bold">SINGLE SEAT</h4>
            <p className="text-lg font-semibold mt-2">$19.99 per month*</p>
            <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
              SELECT
            </button>
          </div>

          {/* Multi-Seat Plan */}
          <div className="border p-6 rounded-lg shadow">
            <h4 className="text-xl font-bold">MULTI-SEAT</h4>
            <p className="text-lg font-semibold mt-2">$19.99 per month*</p>
            <p className="text-gray-600">+ $18.99 per extra seat*</p>
            <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
              SELECT
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-center mt-4 text-sm">
          *Tax not included. Service charges and convenience fees are non-refundable.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;