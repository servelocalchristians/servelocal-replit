import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import { insertOpportunitySchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Calendar, Clock, Users, MapPin, Plus } from "lucide-react";
import { z } from "zod";

const categories = [
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

const formSchema = insertOpportunitySchema.extend({
  requiredSkills: z.string().optional(),
}).omit({
  createdById: true,
});

type FormData = z.infer<typeof formSchema>;

export default function CreateOpportunity() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch user's organizations
  const { data: userOrganizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations/my"],
    retry: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: "",
      startTime: "",
      endTime: "",
      volunteersNeeded: 1,
      requiredSkills: "",
      location: "",
      isRecurring: false,
      recurringPattern: "",
      organizationId: 0,
    },
  });

  // Set default organization when data loads
  useEffect(() => {
    if (userOrganizations?.length > 0) {
      form.setValue("organizationId", userOrganizations[0].organization.id);
    }
  }, [userOrganizations, form]);

  // Redirect if no organizations
  useEffect(() => {
    if (!orgsLoading && !userOrganizations?.length) {
      toast({
        title: "No Church Found",
        description: "Please register your church first to create opportunities.",
      });
      navigate("/register-church");
    }
  }, [orgsLoading, userOrganizations, toast, navigate]);

  const createOpportunityMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const processedData = {
        ...data,
        requiredSkills: data.requiredSkills
          ? data.requiredSkills.split(",").map(skill => skill.trim()).filter(Boolean)
          : [],
      };
      await apiRequest("POST", "/api/opportunities", processedData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Volunteer opportunity created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
      navigate("/church-dashboard");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create opportunity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createOpportunityMutation.mutate(data);
  };

  if (orgsLoading || !userOrganizations?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Create Volunteer Opportunity
          </h1>
          <p className="text-xl text-gray-600">
            Post a new opportunity to connect with volunteers in your community
          </p>
        </div>
        
        <Card className="elevation-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Opportunity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opportunity Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Community Food Drive" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the volunteer opportunity, what volunteers will do, and any requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          Date *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Start Time *
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="volunteersNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          Volunteers Needed *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="12"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Lifting, Organization, Computer Skills (comma-separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Church address or specific meeting location"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>This is a recurring opportunity</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("isRecurring") && (
                    <FormField
                      control={form.control}
                      name="recurringPattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurring Pattern</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recurring pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {userOrganizations.length > 1 && (
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userOrganizations.map((org) => (
                              <SelectItem
                                key={org.organization.id}
                                value={org.organization.id.toString()}
                              >
                                {org.organization.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={createOpportunityMutation.isPending}
                    className="bg-primary hover:bg-blue-700"
                  >
                    {createOpportunityMutation.isPending ? "Creating..." : "Post Opportunity"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/church-dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
