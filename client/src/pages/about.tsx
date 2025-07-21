import { Button } from "@/components/ui/button";
import { Heart, Users, Building, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            About ServeConnect
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Inspired by ancient wisdom, building modern communities through collaborative service
          </p>
        </div>
      </section>

      {/* Nehemiah Story Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              The Nehemiah Principle
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Our inspiration comes from one of history's greatest community rebuilding efforts
            </p>
          </div>

          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="text-xl leading-relaxed mb-6">
              In the book of Nehemiah, we witness an extraordinary story of community collaboration. 
              When Nehemiah received the call to rebuild Jerusalem's broken walls, he didn't work alone. 
              Instead, he organized different tribes, families, and skilled workers—each contributing 
              their unique abilities to restore their shared home.
            </p>

            <div className="bg-blue-50 border-l-4 border-primary p-6 my-8">
              <p className="italic text-lg">
                "Each of the builders wore his sword at his side as he worked. But the man who 
                sounded the trumpet stayed with me... So we continued the work with half the men 
                holding spears, from the first light of dawn till the stars came out."
              </p>
              <cite className="text-sm text-gray-600 mt-2 block">— Nehemiah 4:18, 21</cite>
            </div>

            <p className="text-lg leading-relaxed mb-6">
              What made their efforts successful wasn't just individual dedication, but their 
              systematic approach to collaboration. Different groups took responsibility for 
              different sections of the wall, yet they worked in unity toward a common goal. 
              The goldsmiths worked alongside the perfume-makers, the merchants labored next 
              to the temple servants, and families from various districts contributed according 
              to their abilities.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              This ancient model of organized, collaborative service inspires ServeConnect today. 
              Just as Nehemiah coordinated diverse groups to rebuild Jerusalem's infrastructure, 
              we help coordinate churches and nonprofit organizations to rebuild and strengthen 
              our modern communities.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Application Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              From Ancient Walls to Modern Communities
            </h2>
            <p className="text-xl text-gray-600">
              How the Nehemiah model translates to today's volunteer coordination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Organized Collaboration</h3>
              <p className="text-gray-600 text-center">
                Like Nehemiah's systematic assignment of wall sections, ServeConnect organizes 
                volunteer opportunities by location, skills, and timing to maximize impact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Diverse Unity</h3>
              <p className="text-gray-600 text-center">
                Different tribes worked together in Jerusalem. Today, various churches and 
                nonprofits unite through our platform to serve the broader community.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Shared Purpose</h3>
              <p className="text-gray-600 text-center">
                Jerusalem's walls protected everyone. Our volunteer efforts strengthen the 
                entire community, creating lasting positive change for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            ServeConnect exists to strengthen communities by connecting volunteers with 
            meaningful service opportunities across churches and nonprofit organizations. 
            We believe that when diverse groups work together—like the tribes rebuilding 
            Jerusalem—we can accomplish far more than any single organization working alone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <a href="/auth">
                <Heart className="mr-2 h-5 w-5" />
                Start Volunteering
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/auth">
                <Building className="mr-2 h-5 w-5" />
                Register Organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}