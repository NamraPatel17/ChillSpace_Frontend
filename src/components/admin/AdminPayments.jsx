import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPayments() {
  const [data, setData] = useState({
    transactions: [],
    stats: { totalRevenue: 0, platformFees: 0, hostPayouts: 0, processing: 0 },
    topHosts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/payments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load global payments data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-6">Loading payments data...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Payment Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track all financial transactions and revenue
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{data.stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">Active</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-gray-900" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Fees</p>
                <p className="text-2xl font-semibold text-gray-900">₹{data.stats.platformFees.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">10% Default</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Host Payouts</p>
                <p className="text-2xl font-semibold text-gray-900">₹{data.stats.hostPayouts.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">90% Derived</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-semibold text-gray-900">₹{data.stats.processing.toLocaleString()}</p>
                <div className="flex items-center mt-2 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-gray-600 mr-1" />
                  <span className="text-gray-600">Pending</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Guest Payments</p>
                  <p className="text-xl font-semibold text-gray-900">₹{data.stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">100%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Platform Revenue (10%)</p>
                  <p className="text-xl font-semibold text-gray-900">₹{data.stats.platformFees.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">10%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Host Payouts (90%)</p>
                  <p className="text-xl font-semibold text-gray-900">₹{data.stats.hostPayouts.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">90%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Earning Hosts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topHosts.length > 0 ? data.topHosts.map((host, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{host.name}</p>
                    <p className="text-xs text-gray-500">{host.properties} properties</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">₹{host.earnings.toLocaleString()}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No host earnings calculated yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Host</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Platform Fee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.length > 0 ? data.transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{transaction.guest}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{transaction.host}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-green-600">₹{transaction.platformFee.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      {(() => {
                        const s = transaction.status;
                        const cfg =
                          s === "Completed"   ? "bg-green-100 text-green-800 border border-green-200" :
                          s === "Cancelled"   ? "bg-red-100 text-red-800 border border-red-200" :
                                               "bg-yellow-100 text-yellow-800 border border-yellow-200";
                        return (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg}`}>
                            {s}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="py-4 px-4 text-center text-gray-500">No transactions recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
