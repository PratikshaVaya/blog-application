// Reused for both create and edit flows to avoid duplicated logic

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { categories } from "@/lib/blogService";

const DRAFT_KEY = "blog-draft";

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
}

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

const emptyForm: BlogFormData = {
  title: "",
  description: "",
  content: "",
  category: "Technology",
  tags: [],
  coverImage: "",
  author: "",
};

export function BlogForm({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting,
}: BlogFormProps) {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState<BlogFormData>(() => {
    // Auto-save: Restore draft only for new posts (not editing)
    if (!initialData) {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return emptyForm;
        }
      }
    }
    return initialData || emptyForm;
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({});

  // Pre-fill form when editing existing blog
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Auto-save: Save draft to localStorage while typing (only for new posts)
  useEffect(() => {
    if (!isEditing && formData.title) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, isEditing]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BlogFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveBlog = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Clear draft after successful submission
      localStorage.removeItem(DRAFT_KEY);
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        author: formData.author.trim(),
      });
    }
  };

  const updateField = (field: keyof BlogFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(emptyForm);
  };

  const hasDraft = !isEditing && localStorage.getItem(DRAFT_KEY);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{isEditing ? "Edit Blog Post" : "New Blog Post"}</CardTitle>
          {hasDraft && (
            <Button variant="ghost" size="sm" onClick={clearDraft}>
              Clear Draft
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveBlog} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter blog title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">
              Author
            </label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => updateField("author", e.target.value)}
              placeholder="Enter author name"
              className={errors.author ? "border-destructive" : ""}
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author}</p>
            )}
          </div>

          {/* Category - Simple native select for restraint */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief description of your blog post"
              rows={2}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Write your blog content here..."
              rows={12}
              className={errors.content ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.content ? (
                <p className="text-sm text-destructive">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {formData.content.length} characters
              </span>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <label htmlFor="coverImage" className="text-sm font-medium">
              Cover Image URL (optional)
            </label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
