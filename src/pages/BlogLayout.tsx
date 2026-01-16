import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/lib/blogService";
import { blogKeys } from "@/lib/queryClient";
import { BlogListItem } from "@/components/BlogListItem";
import { BlogDetailPanel } from "@/components/BlogDetailPanel";
import { BlogListItemSkeleton } from "@/components/BlogListItemSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

// Master-detail layout: list on left, content on right
export function BlogLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(id || null);

  useEffect(() => {
    if (id) setSelectedId(id);
  }, [id]);

  // Blogs are treated as server state and managed via TanStack Query
  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: blogKeys.list(),
    queryFn: getBlogs,
  });

  const selectedBlog = blogs?.find((b) => b.id === selectedId);

  // Auto-select first blog when list loads
  useEffect(() => {
    if (!selectedId && blogs?.length) {
      setSelectedId(blogs[0].id);
    }
  }, [blogs, selectedId]);

  const selectBlog = (blogId: string) => {
    setSelectedId(blogId);
    navigate(`/blogs/${blogId}`, { replace: true });
  };

  const handleDeleted = () => {
    if (blogs && blogs.length > 1) {
      const remaining = blogs.filter((b) => b.id !== selectedId);
      if (remaining.length) {
        setSelectedId(remaining[0].id);
        navigate(`/blogs/${remaining[0].id}`, { replace: true });
      }
    } else {
      setSelectedId(null);
      navigate("/blogs", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Blog</h1>
              <p className="text-sm text-muted-foreground">
                Latest articles and insights
              </p>
            </div>
            <Button asChild>
              <Link to="/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Split Panel Layout */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Blog List */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-background rounded-lg border sticky top-24">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Latest Articles</h2>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                {/* Skeleton loading for list */}
                {isLoading && (
                  <div className="divide-y">
                    {[1, 2, 3, 4].map((i) => (
                      <BlogListItemSkeleton key={i} />
                    ))}
                  </div>
                )}

                {isError && (
                  <div className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Error loading blogs</p>
                  </div>
                )}

                {!isLoading && blogs?.length === 0 && (
                  <div className="p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">No blogs yet</p>
                    <Button asChild size="sm">
                      <Link to="/create">Create Blog</Link>
                    </Button>
                  </div>
                )}

                {!isLoading && blogs && blogs.length > 0 && (
                  <div className="divide-y">
                    {blogs.map((blog) => (
                      <BlogListItem
                        key={blog.id}
                        blog={blog}
                        isActive={blog.id === selectedId}
                        onClick={() => selectBlog(blog.id)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Right: Blog Detail */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-6">
                {/* Spinner loading for detail */}
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!isLoading && !selectedBlog && blogs && blogs.length > 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Select a blog</h3>
                    <p className="text-muted-foreground">
                      Choose a blog from the list to view its content
                    </p>
                  </div>
                )}

                {!isLoading && blogs?.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No blogs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first blog post to get started
                    </p>
                    <Button asChild>
                      <Link to="/create">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Blog
                      </Link>
                    </Button>
                  </div>
                )}

                {!isLoading && selectedBlog && (
                  <BlogDetailPanel blog={selectedBlog} onDeleted={handleDeleted} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
