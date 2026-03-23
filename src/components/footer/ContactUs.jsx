import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Contact Info */}
          <div className="bg-gray-900 text-white p-8 sm:p-12">
            <div className="mb-8">
              <Link to={-1} className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
            <p className="text-gray-300 mb-8">We would love to hear from you. Our friendly team is always here to chat.</p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-400 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold">Chat to us</h3>
                  <p className="text-sm text-gray-400 mb-1">Our friendly team is here to help.</p>
                  <p className="text-blue-400 font-medium">hi@chillspace.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-400 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-sm text-gray-400 mb-1">Come say hello at our HQ.</p>
                  <p className="text-gray-300">100 Vacation Blvd<br/>Resort City, RC 12345</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-400 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-sm text-gray-400 mb-1">Mon-Fri from 8am to 5pm.</p>
                  <p className="text-gray-300">+1 (555) 000-0000</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Contact Form */}
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Last name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Leave us a message..."
                ></textarea>
              </div>
              
              <Button type="button" className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
