import React from 'react';

const ReviewMovieCompact = ({ review }) => {
  return (
    <div className="flex flex-col justify-between w-full">
      {/* Movie Title & Date */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {review.movieTitle || 'Unknown Movie'}
        </h2>
        <p className="text-xs text-gray-500">{review.timestamp}</p>
      </div>

      {/* Review Content */}
      <div className="mb-2">
        <p className="text-sm text-gray-700">
          {review.content || 'No review content available.'}
        </p>
      </div>

      {/* Reviewer Info & Rating */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">Reviewed by: {review.reviewer || 'Anonymous'}</p>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-sm text-gray-600">{review.rating || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewMovieCompact;
