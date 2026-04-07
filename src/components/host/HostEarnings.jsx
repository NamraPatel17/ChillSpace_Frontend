import { IndianRupee, TrendingUp, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import PageLoader from "../ui/PageLoader";

export default function HostEarnings() {
  const [earningsData, setEarningsData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    thisMonthBookingsCount: 0,
    pendingPayouts: 0,
    pendingCount: 0,
    averagePerBooking: 0
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all"); // "all" | "last15" | "lastMonth" | "last3Months"

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const url = period !== "all" ? `/hosts/earnings?period=${period}` : "/hosts/earnings";
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEarningsData(res.data.earningsChart || []);
        setTransactions(res.data.transactions || []);
        setStats({
          totalEarnings: res.data.totalEarnings || 0,
          thisMonthEarnings: res.data.thisMonthEarnings || 0,
          thisMonthBookingsCount: res.data.thisMonthBookingsCount || 0,
          pendingPayouts: res.data.pendingPayouts || 0,
          pendingCount: res.data.pendingCount || 0,
          averagePerBooking: res.data.averagePerBooking || 0
        });
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [period]);

  // Transactions are already filtered by the backend based on period
  const filteredTransactions = transactions;

  // Chart: show all returned data (backend already filtered)
  const filteredChart = earningsData;

  const maxAmount = filteredChart.length > 0
    ? Math.max(...filteredChart.map(d => d.amount))
    : 100;

  if (loading) return <PageLoader variant="earnings" />;

  const periods = [
    { key: "all",         label: "All Time" },
    { key: "last15",      label: "Last 15 Days" },
    { key: "lastMonth",   label: "Last Month" },
    { key: "last3Months", label: "Last 3 Months" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
        <p className="mt-1 text-sm text-gray-600">Track your income and payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Lifetime total
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.thisMonthEarnings.toLocaleString()}</p>
          <p className="mt-2 text-sm text-indigo-600">{stats.thisMonthBookingsCount} bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Pending Payouts</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.pendingPayouts.toLocaleString()}</p>
          <p className="mt-2 text-sm text-amber-600">{stats.pendingCount} transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Average Per Booking</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">₹{stats.averagePerBooking.toLocaleString()}</p>
          <p className="mt-2 text-sm text-gray-600">Across all properties</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Earnings</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`inline-flex items-center py-1 px-3 border rounded text-sm transition-colors ${
                  period === p.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "hover:bg-gray-50 text-gray-600 border-gray-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between h-64 gap-4">
          {filteredChart.length === 0 ? (
            <div className="w-full text-center text-gray-500 py-10">No earnings data for this period.</div>
          ) : filteredChart.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg relative group">
                <div
                  className="w-full bg-indigo-600 rounded-t-lg transition-all hover:bg-indigo-700"
                  style={{ height: `${(data.amount / maxAmount) * 200}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                    ₹{data.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">{data.month}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions {period !== "all" && <span className="text-sm font-normal text-gray-500 ml-2">({periods.find(p => p.key === period)?.label})</span>}
          </h2>
          <span className="text-sm text-gray-500">{filteredTransactions.length} record{filteredTransactions.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Transaction ID", "Date", "Property", "Guest", "Amount", "Status"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-sm text-center text-gray-500">No transactions found for this period.</td>
                </tr>
              ) : filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.guest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
