import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  MapPin,
  UserPlus,
  Shield,
  CheckCircle,
  ShieldQuestion,
  Lock,
  Heart,
  Church,
  Calendar,
  Clock,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                ServeConnect
              </span>
              <div className="hidden md:block ml-6 lg:ml-10">
                <div className="flex items-baseline space-x-4">
                  <button className="text-gray-700 hover:text-primary px-2 lg:px-3 py-2 rounded-md text-sm font-medium">
                    Find Opportunities
                  </button>
                  <button className="text-gray-700 hover:text-primary px-2 lg:px-3 py-2 rounded-md text-sm font-medium">
                    For Nonprofits
                  </button>
                  <a
                    href="/about"
                    className="text-gray-700 hover:text-primary px-2 lg:px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button size="sm" asChild>
                <a href="/auth">Start</a>
              </Button>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-2 lg:space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="/auth?tab=login">Sign In</a>
                </Button>
                <Button size="sm" asChild>
                  <a href="/auth">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                Connect. Serve.{" "}
                <span className="text-yellow-300">Strengthen Communities.</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100">
                Bridge the gap between nonprofits and volunteers. Discover
                opportunities to serve beyond your usual groups and strengthen
                the your whole community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-green-600 text-white elevation-2 w-full sm:w-auto"
                  asChild
                >
                  <a href="/auth">
                    <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Find Opportunities
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-green-600 text-white elevation-2 w-full sm:w-auto"
                  asChild
                >
                  <a href="/auth">
                    <Church className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Register Your Nonprofit
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Diverse group of volunteers serving together"
                className="rounded-xl elevation-3 w-full h-48 sm:h-64 lg:h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How ServeConnect Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and designed for faith and nonprofit communities
              of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Easy Registration
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Quick signup for volunteers and secure church verification
                process ensures trust and safety.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="bg-secondary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Location-Based Matching
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Find opportunities near you and get notifications for new
                volunteer needs in your area.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="bg-accent/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Role-Based Management
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Church leaders can assign roles and permissions to team members
                for efficient opportunity management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Dashboards for Every User
            </h2>
            <p className="text-xl text-gray-600">
              Whether you're a volunteer, church, or nonprofit administrator,
              manage everything from one place
            </p>
          </div>

          {/* Sample Opportunity Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="elevation-2">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Community Food Drive
                    </h3>
                    <p className="text-gray-600">Grace Baptist Church</p>
                  </div>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                    2.1 miles
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Saturday, Dec 16</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Users className="h-4 w-4 mr-1" />
                  <span>5 of 12 volunteers signed up</span>
                </div>
                <p className="text-gray-700 mb-4 text-sm">
                  Help sort and distribute food to local families in need. No
                  experience required, just a heart to serve.
                </p>
                <Button size="sm" asChild>
                  <a href="/auth">Sign Up</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="elevation-2">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Youth Mentorship Program
                    </h3>
                    <p className="text-gray-600">New Life Community Church</p>
                  </div>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                    3.7 miles
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Every Tuesday</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>6:00 PM - 8:00 PM</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Users className="h-4 w-4 mr-1" />
                  <span>3 of 8 mentors needed</span>
                </div>
                <p className="text-gray-700 mb-4 text-sm">
                  Be a positive influence in a teenager's life through weekly
                  mentorship sessions.
                </p>
                <Button size="sm" asChild>
                  <a href="/auth">Sign Up</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust and Security Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Built for Trust and Safety
            </h2>
            <p className="text-xl text-gray-600">
              Your security and the integrity of our faith community are our top
              priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600 text-sm">
                Email verification and secure login protect your account
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Church Verification
              </h3>
              <p className="text-gray-600 text-sm">
                All churches undergo verification to ensure legitimacy
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Role Management</h3>
              <p className="text-gray-600 text-sm">
                Controlled access ensures only authorized users can post
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
              <p className="text-gray-600 text-sm">
                Your personal information is encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Strengthen Your Community?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of believers already connecting and serving through
            ServeConnect
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 elevation-2"
              asChild
            >
              <a href="/auth">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up as Volunteer
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 elevation-2"
              asChild
            >
              <a href="/auth">
                <Church className="mr-2 h-5 w-5" />
                Register Your Nonprofit
              </a>
            </Button>
          </div>

          <p className="text-sm text-blue-100 mt-6">
            Free to use • No hidden fees • Secure platform
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">ServeConnect</div>
              <p className="text-gray-400 mb-4">
                Strengthening the body of Christ through collaborative service.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Volunteers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Opportunities</li>
                <li>How It Works</li>
                <li>Success Stories</li>
                <li>Safety Guidelines</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Nonprofits</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Get Started</li>
                <li>Verification Process</li>
                <li>Best Practices</li>
                <li>Resources</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 ServeConnect. All rights reserved. Built with faith
              for the faith community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
