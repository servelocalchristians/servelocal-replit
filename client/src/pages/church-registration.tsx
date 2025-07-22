import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { insertOrganizationSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Church, MapPin, Phone, Mail, Globe, CheckCircle } from "lucide-react";
import { z } from "zod";

const formSchema = insertOrganizationSchema.omit({
  ownerId: true,
});

type FormData = z.infer<typeof formSchema>;

export default function ChurchRegistration() {
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      denominationAffiliation: "",
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register your church.",
      });
      window.location.href = "/auth";
    }
  }, [authLoading, isAuthenticated, toast]);

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("POST", "/api/organizations", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description:
          "Your church has been registered successfully. Welcome to ServeConnect!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/my"] });
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
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to register church. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createOrganizationMutation.mutate(data);
  };

  if (authLoading) {
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
            Register Your Church
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our platform to connect with volunteers and strengthen your
            community through service opportunities
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Church className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Management</h3>
            <p className="text-gray-600 text-sm">
              Simple tools to post and manage volunteer opportunities
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Platform</h3>
            <p className="text-gray-600 text-sm">
              Secure, trusted environment for faith-based organizations
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Reach</h3>
            <p className="text-gray-600 text-sm">
              Connect with volunteers in your local community
            </p>
          </div>
        </div>

        <Card className="elevation-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Church className="mr-2 h-5 w-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Grace Baptist Church"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Tell us about your organization, its mission, and community focus..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Address Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Springfield" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input placeholder="IL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="62701" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="mr-1 h-4 w-4" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="info@gracechurch.org"
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
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Globe className="mr-1 h-4 w-4" />
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.gracechurch.org"
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
                  name="denominationAffiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denomination/Affiliation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Southern Baptist, Methodist, Non-denominational"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">
                        Verification Process
                      </h4>
                      <p className="text-sm text-blue-700">
                        Your organization will undergo a verification process to
                        ensure the safety and trust of our community. This
                        typically takes 1-3 business days. You'll be notified
                        once verification is complete.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={createOrganizationMutation.isPending}
                    className="bg-primary hover:bg-blue-700"
                  >
                    {createOrganizationMutation.isPending
                      ? "Registering..."
                      : "Register Church"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trust Section */}
        <div className="text-center mt-12 p-8 bg-white rounded-lg elevation-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Join a Trusted Community
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ServeConnect is built specifically for faith-based organizations. We
            prioritize security, verification, and creating meaningful
            connections within the Christian community.
          </p>
        </div>
      </main>
    </div>
  );
}
