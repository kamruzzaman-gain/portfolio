import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { authService } from "@/lib/auth";
import type { Experience, InsertExperience } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ExperienceManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertExperience>>({
    company: "",
    role: "",
    duration: "",
    description: "",
    companyLogo: "",
    technologies: [],
    displayOrder: 0
  });

  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      const token = authService.getToken();
      const response = await fetch("/api/admin/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create experience");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Experience created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create experience", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertExperience> }) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update experience");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Experience updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      setEditingId(null);
    },
    onError: () => {
      toast({ title: "Failed to update experience", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete experience");
    },
    onSuccess: () => {
      toast({ title: "Experience deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
    },
    onError: () => {
      toast({ title: "Failed to delete experience", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      duration: "",
      description: "",
      companyLogo: "",
      technologies: [],
      displayOrder: 0
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditingId(experience.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      technologies: formData.technologies?.length ? formData.technologies : []
    };
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave as InsertExperience);
    }
  };

  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(",").map(tech => tech.trim()).filter(tech => tech.length > 0);
    setFormData(prev => ({ ...prev, technologies }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Add New Experience Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Work Experience</h3>
        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setFormData({
              company: "",
              role: "",
              duration: "",
              description: "",
              companyLogo: "",
              technologies: [],
              displayOrder: (experiences?.length || 0)
            });
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Experience" : "Add New Experience"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., TechCorp Solutions"
                />
              </div>
              <div>
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  value={formData.role || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2022 - Present"
                />
              </div>
              <div>
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  value={formData.companyLogo || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyLogo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>
            
            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={formData.technologies?.join(", ") || ""}
                onChange={(e) => handleTechnologiesChange(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB, AWS"
              />
            </div>
            
            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiences List */}
      <div className="grid gap-4">
        {experiences?.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {experience.companyLogo && (
                      <img 
                        src={experience.companyLogo} 
                        alt={`${experience.company} logo`}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{experience.role}</h4>
                      <p className="text-primary font-medium">{experience.company}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <Badge variant="outline">{experience.duration}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {experience.description}
                  </p>
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {experience.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(experience)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(experience.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {experiences?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No work experience added yet. Click "Add Experience" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
