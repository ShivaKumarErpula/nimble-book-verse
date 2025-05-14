
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Book, BookFormData } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface BookFormProps {
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Book;
  isEditing?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    publishedYear: new Date().getFullYear(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        publishedYear: initialData.publishedYear,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.author.trim()) {
      toast({
        title: "Validation Error", 
        description: "Author is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.publishedYear || formData.publishedYear <= 0) {
      toast({
        title: "Validation Error",
        description: "Published year must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast({
        title: `Book ${isEditing ? 'Updated' : 'Added'}`,
        description: `Successfully ${isEditing ? 'updated' : 'added'} "${formData.title}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save book",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedYear">Published Year</Label>
            <Input
              id="publishedYear"
              name="publishedYear"
              type="number"
              value={formData.publishedYear}
              onChange={handleChange}
              placeholder="Year published"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookForm;
