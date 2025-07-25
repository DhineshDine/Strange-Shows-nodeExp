import React from 'react';
import ReviewLayoutNavbar from './ReviewLayoutNavbar';
import ReviewFooter from './ReviewFooter';
import ReviewMovieCompact from './ReviewMovieCompact';
import ReviewSkeletonLoader from './ReviewSkeletonLoader';
//import placeholderImage from '../../assets/placeholder.png';

const ReviewsPage = () => {
  const numberOfReviewsPerLoad = 6;
  const [reviews, setReviews] = React.useState([]);
  const [allReviews, setAllReviews] = React.useState([]);
  const [movieMap, setMovieMap] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = React.useState(false);

  React.useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setIsLoading(true);
    try {
      const reviewsRes = await fetch('http://localhost:5000/reviews');
      const reviewsData = await reviewsRes.json();
      const sortedReviews = reviewsData.sort((a, b) => toDate(b?.timestamp) - toDate(a?.timestamp));

      const movieRes = await fetch('http://localhost:5000/movies');
      const movieData = await movieRes.json();

      const movieMap = {};
      movieData.forEach(movie => {
        movieMap[movie.id] = movie;
      });

      setMovieMap(movieMap);
      setAllReviews(sortedReviews);
      setReviews(sortedReviews.slice(0, numberOfReviewsPerLoad));
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toDate = (timestamp) => {
    if (!timestamp) return new Date(0);
    const [day, month, year] = timestamp.split('.');
    return new Date(`${year}-${month}-${day}`);
  };

  const loadMoreReviews = () => {
    if (reviews.length >= allReviews.length) {
      setIsLoadingMoreReviews(false);
      return;
    }

    setIsLoadingMoreReviews(true);

    const appendedReviews = [
      ...reviews,
      ...allReviews.slice(reviews.length, reviews.length + 6),
    ];

    setTimeout(() => {
      setReviews(appendedReviews);
      setIsLoadingMoreReviews(false);
    }, 500);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = window.scrollY + window.innerHeight;
      const triggerHeight = document.documentElement.scrollHeight - (10 * document.documentElement.scrollHeight) / 100;

      if (totalHeight >= triggerHeight) {
        loadMoreReviews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reviews, allReviews]);

  return (
    <>
      <ReviewLayoutNavbar />
      <div className="pt-5 bg-gray-50 min-h-screen">
        <div className="flex flex-col px-4 md:max-w-4xl mx-auto font-sans">
          <div className="flex justify-between text-gray-500 text-sm border-b border-gray-300 pb-2 mb-4">
            <p>REVIEWS OF CLONNERBOXD</p>
            {isLoading ? (
              <p className="text-gray-400 text-base">Loading...</p>
            ) : (
              <p className="text-gray-400 text-base">{allReviews.length} total reviews</p>
            )}
          </div>

          {isLoading && (
            <>
              <ReviewSkeletonLoader />
              <ReviewSkeletonLoader />
              <ReviewSkeletonLoader />
            </>
          )}

          {!isLoading && !reviews.length && (
            <p className="text-center text-gray-600 text-lg">No reviews yet. Go post one!</p>
          )}

          {!isLoading && reviews.length > 0 && (
            <div className="flex flex-col space-y-3">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-4 border border-gray-200 bg-white shadow-sm rounded-lg p-4 transition hover:shadow-md"
                >
                  <ReviewMovieCompact review={review} />

                  {movieMap[review.movieID] ? (
                    <img
                      className="block max-h-[120px] max-w-[80px] rounded border border-gray-300 object-cover"
                      src={
                        movieMap[review.movieID]?.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movieMap[review.movieID]?.poster_path}`
                          : placeholderImage
                      }
                      alt={`Poster of ${movieMap[review.movieID]?.title}`}
                    />
                  ) : (
                    <img
                      className="block max-h-[120px] max-w-[80px] rounded border border-gray-300 object-cover"
                      src={placeholderImage}
                      alt="No poster available"
                    />
                  )}
                </div>
              ))}

              {isLoadingMoreReviews && (
                <div className="flex justify-center py-4">
                  <div className="flex space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ReviewFooter />
      </div>
    </>
  );
};

export default ReviewsPage;
