import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Newsroom() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 sm:p-12 border border-gray-100 text-center">
        <div className="mb-8 flex justify-start">
          <Link to={-1} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ChillSpace Newsroom</h1>
        <p className="text-gray-600 text-lg">Get the latest announcements, press releases, and media resources.</p>
        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg">
          <p>No new press releases at this time. Stay tuned!</p>
        </div>
      </div>
    </div>
  );
}
