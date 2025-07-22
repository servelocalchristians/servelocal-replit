import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/navbar";
import OpportunityCard from "@/components/opportunity-card";
import { Search, Filter } from "lucide-react";
import {
  type OpportunityWithDetails,
  type VolunteerSignup,
} from "@shared/schema";

const categories = [
  "All Categories",
  "Community Service",
  "Youth Ministry",
  "Senior Care",
  "Event Support",
  "Administrative",
  "Food Service",
  "Education",
  "Construction",
  "Technology",
];

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [limit, setLimit] = useState(20);

  // Fetch opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery<
    OpportunityWithDetails[]
  >({
    queryKey: [
      "/api/opportunities",
      selectedCategory === "All Categories" ? undefined : selectedCategory,
      limit,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (selectedCategory !== "All Categories") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/opportunities?${params}`);
      return response.json();
    },
  });

  // Fetch user signups
  const { data: userSignups } = useQuery<
    (VolunteerSignup & { opportunity: OpportunityWithDetails })[]
  >({
    queryKey: ["/api/user/signups"],
  });

  // Filter opportunities based on search term
  const filteredOpportunities =
    opportunities?.filter(
      (opportunity) =>
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.organization.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    ) || [];

  const handleLoadMore = () => {
    setLimit((prev) => prev + 20);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Find Volunteer Opportunities
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover meaningful ways to serve your community and strengthen your
            faith.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
                className="w-full sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            {opportunitiesLoading
              ? "Loading opportunities..."
              : `Found ${filteredOpportunities.length} opportunities`}
          </p>
        </div>

        {/* Opportunities Grid */}
        {opportunitiesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-6">
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
        ) : filteredOpportunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  isUserSignedUp={userSignups?.some(
                    (signup) =>
                      signup.opportunityId === opportunity.id &&
                      signup.status === "signed_up",
                  )}
                />
              ))}
            </div>

            {/* Load More Button */}
            {opportunities && opportunities.length >= limit && (
              <div className="text-center">
                <Button onClick={handleLoadMore} variant="outline">
                  Load More Opportunities
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="space-y-4">
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    No opportunities found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedCategory !== "All Categories"
                      ? "Try adjusting your search or filters."
                      : "Be the first to create an opportunity for your church!"}
                  </p>
                </div>
                <div className="space-y-2 pt-4">
                  {(searchTerm || selectedCategory !== "All Categories") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All Categories");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button>Register Your Church</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
