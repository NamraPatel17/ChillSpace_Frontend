import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Star, ThumbsUp } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

const renderStars = (rating) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

export default function AdminReviews() {
  const [data, setData] = useState({
    reviews: [],
    stats: { total: 0, averageRating: 0, fiveStar: 0, verified: 0 },
    distribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load global reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <div className="p-6">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Review Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage guest reviews and ratings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.averageRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.fiveStar}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.verified}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.distribution.length > 0 ? data.distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm text-gray-700">{item.stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{item.count}</span>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No ratings processed yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.reviews.length > 0 ? data.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{review.guest}</p>
                      {review.verified && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs shadow-none">Verified</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Stayed at {review.property}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Flag Review
                  </Button>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 text-sm py-4">No reviews submitted yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
