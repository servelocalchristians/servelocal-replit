import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import { Plus, Users, Calendar, BarChart3, Settings, Edit, Eye } from "lucide-react";
import { type OrganizationWithDetails, type OpportunityWithDetails } from "@shared/schema";

export default function ChurchDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Fetch user's organizations
  const { data: userOrganizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations/my"],
    retry: false,
  });

  const primaryOrganization = userOrganizations?.[0]?.organization;

  // Fetch organization details if we have one
  const { data: organizationDetails, isLoading: detailsLoading } = useQuery<OrganizationWithDetails>({
    queryKey: ["/api/organizations", primaryOrganization?.id],
    enabled: !!primaryOrganization?.id,
  });

  // Fetch organization stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/organizations", primaryOrganization?.id, "stats"],
    enabled: !!primaryOrganization?.id,
  });

  // Fetch organization opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<OpportunityWithDetails[]>({
    queryKey: ["/api/opportunities", primaryOrganization?.id],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities?organizationId=${primaryOrganization?.id}`);
      return response.json();
    },
    enabled: !!primaryOrganization?.id,
  });

  // Handle unauthorized errors and redirect to church registration
  useEffect(() => {
    if (!orgsLoading && !userOrganizations?.length) {
      toast({
        title: "No Church Found",
        description: "Please register your church first to access the dashboard.",
      });
      navigate("/register-church");
    }
  }, [orgsLoading, userOrganizations, toast, navigate]);

  // Show loading state
  if (orgsLoading || !primaryOrganization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {primaryOrganization.name} Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your volunteer opportunities and team
            </p>
          </div>
          <Button asChild>
            <Link href="/create-opportunity">
              <Plus className="mr-2 h-4 w-4" />
              Post New Opportunity
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  {statsLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {stats?.activeOpportunities || 0}
                      </div>
                      <div className="text-sm text-gray-600">Active Opportunities</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  {statsLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">
                        {stats?.totalVolunteers || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Volunteers</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  {statsLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">
                        {stats?.completedOpportunities || 0}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Opportunities List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Opportunities</CardTitle>
                  <Button size="sm" asChild>
                    <Link href="/create-opportunity">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {opportunitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : opportunities && opportunities.length > 0 ? (
                  <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {opportunity.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(opportunity.date).toLocaleDateString()} • 
                                {opportunity.startTime} - {opportunity.endTime}
                              </span>
                            </div>
                            <div className="flex items-center text-sm mb-3">
                              <Badge 
                                variant={opportunity.isActive ? "default" : "secondary"}
                                className={opportunity.isActive ? "bg-secondary" : ""}
                              >
                                {opportunity.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-gray-600 ml-3">
                                {opportunity.currentVolunteers} of {opportunity.volunteersNeeded} volunteers
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                          <button className="text-primary hover:underline">
                            View Volunteers
                          </button>
                          <button className="text-primary hover:underline">
                            Send Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No opportunities yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first volunteer opportunity to get started.
                    </p>
                    <Button asChild>
                      <Link href="/create-opportunity">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Opportunity
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/create-opportunity">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Opportunity
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Organization Settings
                </Button>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Info</CardTitle>
              </CardHeader>
              <CardContent>
                {detailsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : organizationDetails ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm text-gray-600">{organizationDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600">
                        {organizationDetails.city}, {organizationDetails.state}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge 
                        variant={organizationDetails.isVerified ? "default" : "secondary"}
                        className={organizationDetails.isVerified ? "bg-secondary" : ""}
                      >
                        {organizationDetails.isVerified ? "Verified" : "Pending Verification"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Team Members</p>
                      <p className="text-sm text-gray-600">{organizationDetails.members.length}</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">Dashboard accessed</div>
                    <div className="text-gray-500 text-xs">Just now</div>
                  </div>
                  {opportunities && opportunities.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium">Opportunity created</div>
                      <div className="text-gray-600">{opportunities[0].title}</div>
                      <div className="text-gray-500 text-xs">
                        {new Date(opportunities[0].createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
