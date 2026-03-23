import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 sm:p-12 border border-gray-100">
        
        <div className="mb-8">
          <Link to={-1} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-gray-500 mb-8 text-sm">Last updated: March 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ChillSpace, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. User Accounts</h2>
            <p>
              To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Booking and Payments</h2>
            <p>
              When you book a property, you agree to pay the total price shown during checkout. This includes the nightly rate, applicable fees, and taxes. ChillSpace reserves the right to cancel bookings in cases of suspected fraud or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Host Responsibilities</h2>
            <p>
              Hosts are responsible for ensuring that their listings are accurate and that the property meets all local zoning and safety regulations. ChillSpace does not guarantee the accuracy of any listing or any user content.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
