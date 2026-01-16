import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlog } from "@/lib/blogService";
import { blogKeys } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Clock, User, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Blog } from "@/lib/blogService";

interface BlogDetailPanelProps {
  blog: Blog;
  onDeleted?: () => void;
}

export function BlogDetailPanel({ blog, onDeleted }: BlogDetailPanelProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: removeBlog } = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.list() });
      toast({ title: "Blog deleted", description: "The post has been removed." });
      onDeleted?.();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    },
  });

  const getCategoryClass = (category: string) => {
    const classes: Record<string, string> = {
      Finance: "bg-blue-100 text-blue-700",
      Career: "bg-green-100 text-green-700",
      Regulations: "bg-amber-100 text-amber-700",
      Skills: "bg-purple-100 text-purple-700",
      Technology: "bg-cyan-100 text-cyan-700",
    };
    return classes[category] || "bg-gray-100 text-gray-700";
  };

  const tags = blog.tags || [];

  return (
    <div className="h-full overflow-y-auto">
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-lg overflow-hidden mb-6">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 sm:h-64 object-cover"
          />
        </div>
      )}

      {/* Category and read time */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {blog.category && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryClass(blog.category)}`}>
            {blog.category}
          </span>
        )}
        {blog.readTime && (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {blog.readTime}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{blog.title}</h1>

      {/* Share */}
      <Button variant="default" size="sm" className="mb-6">
        <Share2 className="h-4 w-4 mr-2" />
        Share Article
      </Button>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Category</p>
            <p className="text-sm font-medium">{blog.category || "General"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Read Time</p>
            <p className="text-sm font-medium">{(blog.readTime || "3 min").replace(" read", "")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Date</p>
            <p className="text-sm font-medium">{blog.createdAt}</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {blog.description && (
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          {blog.description}
        </p>
      )}

      {/* Content */}
      <div className="prose prose-sm max-w-none mb-6">
        {(blog.content || "").split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-lg font-semibold mt-6 mb-3">{line.replace("## ", "")}</h2>;
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="border-l-4 border-primary bg-primary/5 pl-4 py-3 italic my-4">
                {line.replace("> ", "")}
              </blockquote>
            );
          }
          if (line.startsWith("- ")) {
            return <li key={i} className="ml-4 list-disc">{line.replace("- ", "")}</li>;
          }
          if (line.trim()) {
            return <p key={i} className="mb-3 leading-relaxed">{line}</p>;
          }
          return null;
        })}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 border rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-3 py-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Written by {blog.author || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">Author</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 pb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/edit/${blog.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeBlog(blog.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
