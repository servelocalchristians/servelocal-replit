import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { type OpportunityWithDetails } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface OpportunityCardProps {
  opportunity: OpportunityWithDetails;
  showSignupButton?: boolean;
  isUserSignedUp?: boolean;
}

export default function OpportunityCard({
  opportunity,
  showSignupButton = true,
  isUserSignedUp = false,
}: OpportunityCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProgressPercentage = () => {
    return (opportunity.currentVolunteers / opportunity.volunteersNeeded) * 100;
  };

  const getStatusColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return "bg-secondary";
    if (percentage >= 70) return "bg-accent";
    return "bg-red-500";
  };

  const signupMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/opportunities/${opportunity.id}/signup`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've successfully signed up for this opportunity.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/signups"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to sign up for opportunity. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="elevation-1 hover:elevation-2 transition-all duration-200 h-full">
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
              {opportunity.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 truncate">{opportunity.organization.name}</p>
          </div>
          <Badge variant="secondary" className={`${getStatusColor()} text-white text-xs sm:text-sm flex-shrink-0`}>
            {opportunity.currentVolunteers}/{opportunity.volunteersNeeded} volunteers
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-600 mb-3 gap-1 sm:gap-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{formatDate(opportunity.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="text-xs sm:text-sm">
              {formatTime(opportunity.startTime)} - {formatTime(opportunity.endTime)}
            </span>
          </div>
        </div>

        {opportunity.location && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        )}

        <Badge variant="outline" className="mb-3 self-start text-xs">
          {opportunity.category}
        </Badge>

        <p className="text-gray-700 text-xs sm:text-sm mb-4 line-clamp-3 flex-grow">
          {opportunity.description}
        </p>

        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {opportunity.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mt-auto">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>
              {opportunity.currentVolunteers} of {opportunity.volunteersNeeded} signed up
            </span>
          </div>

          {showSignupButton && !isUserSignedUp && (
            <Button
              onClick={() => signupMutation.mutate()}
              disabled={
                signupMutation.isPending ||
                opportunity.currentVolunteers >= opportunity.volunteersNeeded
              }
              size="sm"
            >
              {signupMutation.isPending
                ? "Signing up..."
                : opportunity.currentVolunteers >= opportunity.volunteersNeeded
                ? "Full"
                : "Sign Up"}
            </Button>
          )}

          {isUserSignedUp && (
            <Badge variant="default" className="bg-secondary">
              Signed Up
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
