import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlog } from "@/lib/blogService";
import { blogKeys } from "@/lib/queryClient";
import { BlogForm, BlogFormData } from "@/components/BlogForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateBlog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: saveBlog, isPending } = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.list() });
      toast({ title: "Blog created", description: "Your post has been published." });
      navigate("/blogs");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create blog.", variant: "destructive" });
    },
  });

  const handleSubmit = (data: BlogFormData) => saveBlog(data);

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/blogs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Link>
      </Button>

      <BlogForm
        onSubmit={handleSubmit}
        submitLabel="Create Blog"
        isSubmitting={isPending}
      />
    </div>
  );
}
