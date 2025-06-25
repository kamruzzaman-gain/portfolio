import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Calendar, Trash2, MailOpen, MessageSquare } from "lucide-react";
import { authService } from "@/lib/auth";
import type { ContactMessage } from "@shared/schema";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ContactMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const token = authService.getToken();
      const response = await fetch("/api/admin/contacts", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch contact messages");
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/contacts/${id}/read`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to mark message as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
    onError: () => {
      toast({ title: "Failed to mark message as read", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = authService.getToken();
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete message");
    },
    onSuccess: () => {
      toast({ title: "Message deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSubjectDisplay = (subject: string) => {
    const subjectMap: Record<string, string> = {
      project: "New Project Inquiry",
      collaboration: "Collaboration Opportunity",
      consultation: "Consultation Request",
      other: "Other"
    };
    return subjectMap[subject] || subject;
  };

  const unreadCount = messages?.filter(msg => !msg.read).length || 0;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Contact Messages</h3>
          <p className="text-sm text-muted-foreground">
            {messages?.length || 0} total messages, {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive">
            {unreadCount} new
          </Badge>
        )}
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {messages?.map((message) => (
          <Card key={message.id} className={`${!message.read ? 'border-primary bg-primary/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-base">
                      {message.firstName} {message.lastName}
                    </CardTitle>
                    {!message.read && (
                      <Badge variant="destructive" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <a href={`mailto:${message.email}`} className="hover:text-primary">
                        {message.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!message.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <MailOpen className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(message.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Subject:</span>
                  <Badge variant="outline">{getSubjectDisplay(message.subject)}</Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={`mailto:${message.email}?subject=Re: ${getSubjectDisplay(message.subject)}`}>
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {messages?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No contact messages yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
