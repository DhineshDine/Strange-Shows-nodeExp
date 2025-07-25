import React, { useState } from "react";

const OnlyAtStrangeAdmin = () => {
  const [specials, setSpecials] = useState([
    // Example specials
    { id: 1, title: "Exclusive Premiere: The Secret Film", description: "One-night-only experience!" },
    { id: 2, title: "Director's Cut Screening", description: "Q&A with the director after the show." },
  ]);

  const handleAddSpecial = () => {
    console.log("Add Strange exclusive");
  };

  const handleEditSpecial = (id) => {
    console.log("Edit Strange exclusive", id);
  };

  const handleDeleteSpecial = (id) => {
    console.log("Delete Strange exclusive", id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Only at Strange Specials</h2>
      <button
        onClick={handleAddSpecial}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        Add Special
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 bg-gray-800 text-white rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {specials.map((special) => (
              <tr key={special.id} className="border-t border-gray-700">
                <td className="py-2 px-4">{special.title}</td>
                <td className="py-2 px-4">{special.description}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleEditSpecial(special.id)}
                    className="bg-yellow-500 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSpecial(special.id)}
                    className="bg-red-600 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {specials.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No special events listed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlyAtStrangeAdmin;
