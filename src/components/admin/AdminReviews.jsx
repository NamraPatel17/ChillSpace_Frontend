import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Star, ThumbsUp, Trash2, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const renderStars = (rating) =>
  Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-3.5 w-3.5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
    />
  ));

const Avatar = ({ picture, name, size = "h-9 w-9" }) => (
  <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0`}>
    {picture ? (
      <img src={picture} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-xs font-semibold text-gray-600">
        {(name || "?").charAt(0).toUpperCase()}
      </span>
    )}
  </div>
);

export default function AdminReviews() {
  const [data, setData] = useState({
    reviews: [],
    guestReviews: [],
    stats: { total: 0, averageRating: 0, fiveStar: 0, guestAvgRating: 0, guestFiveStar: 0 },
    distribution: [],
    guestDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setData(res.data);
    } catch (err) {
      console.error("Failed to load global reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`/admin/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review deleted successfully");
      setSelectedReview(null);
      setConfirmingDelete(false);
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <div className="p-6">Loading reviews...</div>;

  const ReviewCard = ({ review, isGuestReview = false }) => (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {isGuestReview ? (
            // For host→guest reviews show both avatars
            <div className="flex items-center gap-2">
              <div className="text-center">
                <Avatar picture={review.reviewerPicture} name={review.reviewer} />
                <span className="text-[9px] text-gray-400 block mt-0.5">Host</span>
              </div>
              <span className="text-gray-300 text-xs">→</span>
              <div className="text-center">
                <Avatar picture={review.guestPicture} name={review.guest} />
                <span className="text-[9px] text-gray-400 block mt-0.5">Guest</span>
              </div>
            </div>
          ) : (
            <Avatar picture={review.guestPicture} name={review.guest} />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              {isGuestReview ? (
                <p className="text-sm font-medium text-gray-900">
                  <span className="text-gray-600">{review.reviewer}</span>
                  <span className="text-gray-400 mx-1 text-xs">reviewed</span>
                  <span>{review.guest}</span>
                </p>
              ) : (
                <p className="text-sm font-medium text-gray-900">{review.guest}</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1.5">
              {isGuestReview ? "Guest review · " : "Stayed at · "}
              <span className="font-medium text-gray-700">{review.property}</span>
              {" · "}{review.date}
            </p>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(review.rating)}
              <span className="text-xs text-gray-500 ml-1">{review.rating}/5</span>
            </div>
            {review.reviewText && (
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
                "{review.reviewText}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-900 text-xs px-3 h-8"
            onClick={() => setSelectedReview({ ...review, isGuestReview })}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Review Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage all reviews across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Property Reviews</p><p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p></div><Star className="h-8 w-8 text-yellow-400 fill-yellow-400" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Average Rating</p><p className="text-2xl font-semibold text-gray-900">{data.stats.averageRating}</p></div><Star className="h-8 w-8 text-yellow-400 fill-yellow-400" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">5-Star Reviews</p><p className="text-2xl font-semibold text-gray-900">{data.stats.fiveStar}</p></div><ThumbsUp className="h-8 w-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-600">Guest Reviews</p><p className="text-2xl font-semibold text-gray-900">{data.guestReviews?.length || 0}</p></div><ThumbsUp className="h-8 w-8 text-blue-600" /></div></CardContent></Card>
      </div>

      {/* Rating Distributions - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Review Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Review Ratings</CardTitle>
            <p className="text-xs text-gray-400">Distribution based on {data.reviews.length} property reviews · Avg {data.stats.averageRating}/5</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.distribution.length > 0 ? data.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8 flex-shrink-0">
                    <span className="text-sm text-gray-700">{item.stars}</span>
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-sm text-gray-700 font-medium">{item.count}</span>
                    <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-400">No property reviews yet.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Guest Review Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Review Ratings</CardTitle>
            <p className="text-xs text-gray-400">Distribution based on {data.guestReviews?.length || 0} guest reviews · Avg {data.stats.guestAvgRating}/5</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.guestDistribution?.length > 0 && data.guestReviews?.length > 0 ? data.guestDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8 flex-shrink-0">
                    <span className="text-sm text-gray-700">{item.stars}</span>
                    <Star className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-sm text-gray-700 font-medium">{item.count}</span>
                    <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-400">No guest reviews written by hosts yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Reviews <span className="text-sm font-normal text-gray-400 ml-1">({data.reviews.length})</span></CardTitle>
          <p className="text-xs text-gray-400">Reviews written by guests about properties</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {data.reviews.length > 0 ? data.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} isGuestReview={false} />
            )) : (
              <p className="text-center text-gray-500 text-sm py-4">No property reviews yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guest Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Reviews <span className="text-sm font-normal text-gray-400 ml-1">({data.guestReviews?.length || 0})</span></CardTitle>
          <p className="text-xs text-gray-400">Reviews written by hosts about guests</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {data.guestReviews?.length > 0 ? data.guestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} isGuestReview={true} />
            )) : (
              <p className="text-center text-gray-500 text-sm py-4">No guest reviews written by hosts yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => { setSelectedReview(null); setConfirmingDelete(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedReview.isGuestReview ? "Guest Review Details" : "Property Review Details"}
            </h3>
            <div className="space-y-3 text-sm">
              {selectedReview.isGuestReview ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar picture={selectedReview.reviewerPicture} name={selectedReview.reviewer} />
                    <div><p className="text-xs text-gray-400">Reviewer (Host)</p><p className="font-medium">{selectedReview.reviewer}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar picture={selectedReview.guestPicture} name={selectedReview.guest} />
                    <div><p className="text-xs text-gray-400">Reviewed Guest</p><p className="font-medium">{selectedReview.guest}</p></div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar picture={selectedReview.guestPicture} name={selectedReview.guest} />
                  <div><p className="text-xs text-gray-400">Guest</p><p className="font-medium">{selectedReview.guest}</p></div>
                </div>
              )}
              <div className="flex justify-between"><span className="text-gray-500">Property</span><span className="font-medium">{selectedReview.property}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500">Rating</span><div className="flex">{renderStars(selectedReview.rating)}</div></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{selectedReview.date}</span></div>
              {selectedReview.reviewText && (
                <div>
                  <span className="text-gray-500 block mb-1">Review Text</span>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">"{selectedReview.reviewText}"</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              {confirmingDelete ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800 mb-1">Delete this review?</p>
                  <p className="text-xs text-red-600 mb-3">This action is permanent and cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                      onClick={() => handleDelete(selectedReview.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Yes, Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setConfirmingDelete(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedReview(null); setConfirmingDelete(false); }}>Close</Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
