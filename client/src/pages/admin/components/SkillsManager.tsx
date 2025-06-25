import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { authService } from "@/lib/auth";
import type { Skill, InsertSkill } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function SkillsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertSkill>>({
    name: "",
    category: "",
    icon: "",
    proficiency: 1,
    displayOrder: 0
  });

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const token = authService.getToken();
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create skill");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Skill created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create skill", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertSkill> }) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update skill");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Skill updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setEditingId(null);
    },
    onError: () => {
      toast({ title: "Failed to update skill", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete skill");
    },
    onSuccess: () => {
      toast({ title: "Skill deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
    onError: () => {
      toast({ title: "Failed to delete skill", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      icon: "",
      proficiency: 1,
      displayOrder: 0
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (skill: Skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData as InsertSkill);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Add New Skill Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Skills</h3>
        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            setFormData({
              name: "",
              category: "",
              icon: "",
              proficiency: 1,
              displayOrder: (skills?.length || 0)
            });
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill" : "Add New Skill"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., React"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Development</SelectItem>
                    <SelectItem value="backend">Backend Development</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="tools">Tools & Others</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., ⚛️"
                />
              </div>
              <div>
                <Label htmlFor="proficiency">Proficiency (1-10)</Label>
                <Input
                  id="proficiency"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.proficiency || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
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

      {/* Skills List */}
      <div className="grid gap-4">
        {skills?.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <h4 className="font-semibold">{skill.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{skill.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Proficiency: {skill.proficiency}/10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(skill.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {skills?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No skills added yet. Click "Add Skill" to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
