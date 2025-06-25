import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authService } from "@/lib/auth";
import type { UserProfile, InsertUserProfile } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function UserProfileForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState<Partial<InsertUserProfile>>({});

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertUserProfile>) => {
      const token = authService.getToken();
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertUserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name ?? profile?.name ?? ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email ?? profile?.email ?? ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone ?? profile?.phone ?? ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location ?? profile?.location ?? ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea
          id="bio"
          rows={3}
          value={formData.bio ?? profile?.bio ?? ""}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Brief description about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="fullBio">Full Biography</Label>
        <Textarea
          id="fullBio"
          rows={6}
          value={formData.fullBio ?? profile?.fullBio ?? ""}
          onChange={(e) => handleInputChange("fullBio", e.target.value)}
          placeholder="Detailed biography..."
        />
      </div>

      <div>
        <Label htmlFor="profileImage">Profile Image URL</Label>
        <Input
          id="profileImage"
          value={formData.profileImage ?? profile?.profileImage ?? ""}
          onChange={(e) => handleInputChange("profileImage", e.target.value)}
          placeholder="https://example.com/profile.jpg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl ?? profile?.githubUrl ?? ""}
            onChange={(e) => handleInputChange("githubUrl", e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>
        
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedinUrl ?? profile?.linkedinUrl ?? ""}
            onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        
        <div>
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input
            id="twitterUrl"
            value={formData.twitterUrl ?? profile?.twitterUrl ?? ""}
            onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
            placeholder="https://twitter.com/username"
          />
        </div>
        
        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            value={formData.websiteUrl ?? profile?.websiteUrl ?? ""}
            onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
