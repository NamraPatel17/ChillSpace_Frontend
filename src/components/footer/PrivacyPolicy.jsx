import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 sm:p-12 border border-gray-100">
        
        <div className="mb-8">
          <Link to={-1} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8 text-sm">Last updated: March 2026</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include your name, email address, phone number, and postal address.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect about you to provide, maintain, and improve our services, including to process transactions, send related information (such as confirmations and receipts), and perform internal operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Sharing of Information</h2>
            <p>
              We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We will not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Search Functionality and Cookies</h2>
            <p>
              We use cookies to uniquely identify your browser and improve the quality of our service. You can reset your web browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
