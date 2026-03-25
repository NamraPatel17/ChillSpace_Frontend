import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
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

  // Filters
  const [ratingFilter, setRatingFilter] = useState(0);    // 0 = all
  const [propertyFilter, setPropertyFilter] = useState("All");

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

  // Unique property names for filter dropdown
  const propertyOptions = useMemo(() => {
    const names = [...new Set(reviews.map(r => r.property).filter(Boolean))];
    return ["All", ...names];
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (ratingFilter > 0 && r.rating !== ratingFilter) return false;
      if (propertyFilter !== "All" && r.property !== propertyFilter) return false;
      return true;
    });
  }, [reviews, ratingFilter, propertyFilter]);

  const totalRatings = stats.fiveStars + stats.fourStars + stats.threeStars + stats.twoStars + stats.oneStars;
  const getPercentage = (count) => (totalRatings === 0 ? 0 : (count / totalRatings) * 100);

  if (loading) return <div className="p-6">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="mt-1 text-sm text-gray-600">Guest feedback and ratings for your properties</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          {[0, 5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(ratingFilter === r && r !== 0 ? 0 : r)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                ratingFilter === r
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {r === 0 ? "All" : <>{r} <Star className="h-3 w-3 fill-current" /></>}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="text-center lg:border-r border-gray-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 rounded-full mb-4">
              <Star className="h-12 w-12 text-amber-400 fill-current" />
            </div>
            <p className="text-4xl font-bold text-gray-900">{stats.averageRating}</p>
            <p className="text-sm text-gray-600 mt-1">Average Rating ({stats.totalReviews} reviews)</p>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {[
              { stars: 5, count: stats.fiveStars },
              { stars: 4, count: stats.fourStars },
              { stars: 3, count: stats.threeStars },
              { stars: 2, count: stats.twoStars },
              { stars: 1, count: stats.oneStars },
            ].map((item) => (
              <button
                key={item.stars}
                onClick={() => setRatingFilter(ratingFilter === item.stars ? 0 : item.stars)}
                className="w-full flex items-center gap-4 group"
              >
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium text-gray-900">{item.stars}</span>
                  <Star className="h-4 w-4 text-amber-400 fill-current ml-1" />
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      ratingFilter === item.stars ? "bg-indigo-600" : "bg-amber-400"
                    }`}
                    style={{ width: `${getPercentage(item.count)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter summary */}
      {(ratingFilter > 0 || propertyFilter !== "All") && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredReviews.length}</span> of {reviews.length} reviews
          </p>
          <button
            onClick={() => { setRatingFilter(0); setPropertyFilter("All"); }}
            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No reviews match your current filters.
          </div>
        ) : filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-indigo-700">
                      {review.guest ? review.guest.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.guest}</h3>
                  <p className="text-sm text-gray-600">{review.property}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.response ? (
              <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-600">
                <p className="text-sm font-semibold text-indigo-900 mb-2">Your Response:</p>
                <p className="text-sm text-gray-700">{review.response}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-indigo-300 text-indigo-700 hover:bg-indigo-50 h-9 px-3 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Respond
                </button>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100 text-gray-700 h-9 px-3 transition-colors">
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
