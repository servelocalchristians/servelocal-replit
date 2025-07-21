import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import OpportunityCard from "@/components/opportunity-card";
import { Calendar, Clock, Users } from "lucide-react";
import { type OpportunityWithDetails, type VolunteerSignup } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  // Fetch nearby opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<OpportunityWithDetails[]>({
    queryKey: ["/api/opportunities"],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities?limit=6`);
      return response.json();
    },
  });

  // Fetch user stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  // Fetch user signups
  const { data: userSignups, isLoading: signupsLoading } = useQuery<(VolunteerSignup & { opportunity: OpportunityWithDetails })[]>({
    queryKey: ["/api/user/signups"],
  });

  const upcomingSignups = userSignups?.filter(signup => 
    signup.status === 'signed_up' && 
    new Date(signup.opportunity.date) >= new Date()
  ).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "Friend"}!
          </h1>
          <p className="text-gray-600">
            Ready to make a difference in your community today?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button asChild>
                    <Link href="/opportunities">
                      <Users className="mr-2 h-4 w-4" />
                      Find Opportunities
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/register-church">
                      <Calendar className="mr-2 h-4 w-4" />
                      Register Your Church
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Opportunities */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Opportunities Near You
                </h2>
                <Button variant="outline" asChild>
                  <Link href="/opportunities">View All</Link>
                </Button>
              </div>

              {opportunitiesLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : opportunities && opportunities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      isUserSignedUp={userSignups?.some(signup => 
                        signup.opportunityId === opportunity.id && 
                        signup.status === 'signed_up'
                      )}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-600 mb-4">
                      No opportunities available at the moment.
                    </p>
                    <Button asChild>
                      <Link href="/register-church">
                        Register Your Church
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hours Volunteered</span>
                      <span className="text-2xl font-bold text-primary">
                        {stats?.hoursVolunteered || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Opportunities Completed</span>
                      <span className="text-2xl font-bold text-secondary">
                        {stats?.opportunitiesCompleted || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Churches Served</span>
                      <span className="text-2xl font-bold text-accent">
                        {stats?.churchesServed || 0}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Your Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {signupsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4 last:border-b-0">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : upcomingSignups.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSignups.map((signup) => (
                      <div key={signup.id} className="border-b pb-4 last:border-b-0">
                        <div className="text-sm text-gray-600 mb-1">
                          {new Date(signup.opportunity.date).toLocaleDateString()} • {signup.opportunity.startTime}
                        </div>
                        <div className="font-medium text-sm">
                          {signup.opportunity.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {signup.opportunity.organization.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm mb-3">
                      No upcoming events yet.
                    </p>
                    <Button size="sm" asChild>
                      <Link href="/opportunities">Find Opportunities</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
