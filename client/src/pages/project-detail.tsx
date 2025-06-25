import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NotFound from "./not-found";

export default function ProjectDetail() {
  const { id } = useParams();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return <NotFound />;
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/#projects">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {project.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {project.liveUrl && (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>
              )}
              {project.featured && (
                <Badge className="bg-primary">Featured Project</Badge>
              )}
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Project Image */}
          {project.coverImage && (
            <div className="mb-8">
              <img 
                src={project.coverImage}
                alt={project.title}
                className="w-full rounded-xl shadow-lg object-cover max-h-96"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.fullDescription || project.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-1">{formatDate(project.createdAt)}</span>
                    </div>
                    
                    {project.liveUrl && (
                      <div>
                        <span className="text-sm text-muted-foreground">Live URL:</span>
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline text-sm mt-1 break-all"
                        >
                          {project.liveUrl}
                        </a>
                      </div>
                    )}
                    
                    {project.githubUrl && (
                      <div>
                        <span className="text-sm text-muted-foreground">Repository:</span>
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline text-sm mt-1 break-all"
                        >
                          {project.githubUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {project.technologies && project.technologies.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Back to Projects */}
          <div className="mt-12 text-center">
            <Link href="/#projects">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
