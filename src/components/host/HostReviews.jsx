import { Star, ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HostReviews() {
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  });
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/hosts/reviews", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setStats(res.data.stats || stats);
          setReviews(res.data.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch host reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const totalRatings =
    stats.fiveStars +
    stats.fourStars +
    stats.threeStars +
    stats.twoStars +
    stats.oneStars;

  const getPercentage = (count) => {
    if (totalRatings === 0) return 0;
    return (count / totalRatings) * 100;
  };

  if (loading) {
    return <div className="p-6">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-1 text-sm text-gray-600">
            Guest feedback and ratings for your properties
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="text-center lg:border-r border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-4">
              <Star className="h-12 w-12 text-yellow-400 fill-current" />
            </div>
            <p className="text-4xl font-bold text-gray-900">
              {stats.averageRating}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Average Rating ({stats.totalReviews} reviews)
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="lg:col-span-2 space-y-3">
            {[
              { stars: 5, count: stats.fiveStars },
              { stars: 4, count: stats.fourStars },
              { stars: 3, count: stats.threeStars },
              { stars: 2, count: stats.twoStars },
              { stars: 1, count: stats.oneStars },
            ].map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center w-20">
                  <span className="text-sm font-medium text-gray-900">
                    {item.stars}
                  </span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${getPercentage(item.count)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
             No reviews have been submitted for your properties yet.
          </div>
        ) : reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-900">
                      {review.guest ? review.guest.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.guest}
                  </h3>
                  <p className="text-sm text-gray-600">{review.property}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 mb-4">{review.comment}</p>

            {/* Host Response */}
            {review.response ? (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-900">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Your Response:
                </p>
                <p className="text-sm text-gray-700">{review.response}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Respond
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100 text-gray-700 h-9 px-3">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Thank Guest
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
