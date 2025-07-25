import React from 'react';

const ReviewSkeletonLoader = () => {
  return (
    <div className="flex w-full justify-between gap-4 rounded-md border border-gray-200 bg-gray-100 p-4 animate-pulse mb-4">
      {/* Left side: Review skeleton */}
      <div className="flex flex-col w-full space-y-3">
        {/* Title skeleton */}
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>

        {/* Timestamp skeleton */}
        <div className="h-3 w-1/6 bg-gray-300 rounded"></div>

        {/* Review content lines */}
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
        <div className="h-3 w-2/3 bg-gray-300 rounded"></div>

        {/* Reviewer + Rating */}
        <div className="flex justify-between items-center mt-2">
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
          <div className="h-3 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Right side: Poster skeleton */}
      <div className="h-[120px] w-[80px] bg-gray-300 rounded-md"></div>
    </div>
  );
};

export default ReviewSkeletonLoader;
