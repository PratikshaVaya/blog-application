import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogById, updateBlog } from "@/lib/blogService";
import { blogKeys } from "@/lib/queryClient";
import { BlogForm, BlogFormData } from "@/components/BlogForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: blogKeys.detail(id!),
    queryFn: () => getBlogById(id!),
    enabled: !!id,
  });

  const { mutate: saveBlog, isPending } = useMutation({
    mutationFn: (data: BlogFormData) => updateBlog(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.list() });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id!) });
      toast({ title: "Blog updated", description: "Your changes have been saved." });
      navigate(`/blogs/${id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update blog.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: BlogFormData) => saveBlog(data);

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !blog) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Blog Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The blog you're trying to edit doesn't exist.
            </p>
            <Button asChild>
              <Link to="/blogs">View All Blogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/blogs/${id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      <BlogForm
        initialData={{
          title: blog.title,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          tags: blog.tags,
          coverImage: blog.coverImage,
          author: blog.author,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isSubmitting={isPending}
      />
    </div>
  );
}
