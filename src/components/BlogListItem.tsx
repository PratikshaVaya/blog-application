import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Briefcase, Scale, Lightbulb, Monitor } from "lucide-react";
import type { Blog } from "@/lib/blogService";

interface BlogListItemProps {
  blog: Blog;
  isActive: boolean;
  onClick: () => void;
}

// Compact list item for sidebar navigation
export function BlogListItem({ blog, isActive, onClick }: BlogListItemProps) {
  // Fallback for description
  const descriptionText = blog.description || blog.content || "";
  const excerpt =
    descriptionText.length > 80
      ? descriptionText.substring(0, 80) + "..."
      : descriptionText;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      Finance: <TrendingUp className="h-3 w-3" />,
      Career: <Briefcase className="h-3 w-3" />,
      Regulations: <Scale className="h-3 w-3" />,
      Skills: <Lightbulb className="h-3 w-3" />,
      Technology: <Monitor className="h-3 w-3" />,
    };
    return icons[category] || null;
  };

  // Get category color
  const getCategoryClass = (category: string) => {
    const classes: Record<string, string> = {
      Finance: "text-blue-600",
      Career: "text-green-600",
      Regulations: "text-amber-600",
      Skills: "text-purple-600",
      Technology: "text-cyan-600",
    };
    return classes[category] || "text-gray-600";
  };

  const tags = blog.tags || [];

  return (
    <div
      onClick={onClick}
      className={`p-4 border-l-4 cursor-pointer transition-all ${
        isActive
          ? "border-l-primary bg-primary/5"
          : "border-l-transparent hover:border-l-muted-foreground/30 hover:bg-muted/50"
      }`}
    >
      {/* Category and date */}
      <div className="flex items-center justify-between mb-2">
        <span className={`flex items-center gap-1 text-xs font-medium uppercase ${getCategoryClass(blog.category || "")}`}>
          {getCategoryIcon(blog.category || "")}
          {blog.category}
        </span>
        <span className="text-xs text-muted-foreground">
          {blog.createdAt}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2">
        {blog.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {excerpt}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs py-0 px-2">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
