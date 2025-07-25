import React from 'react';
import ReviewSkeletonLoader from './ReviewSkeletonLoader';

const ReviewSkeletonLoaderList = ({ count = 3 }) => {
  return (
    <div className="flex flex-col space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ReviewSkeletonLoader key={index} />
      ))}
    </div>
  );
};

export default ReviewSkeletonLoaderList;
