
import React from 'react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { PencilIcon, TrashIcon, BookOpenIcon } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onView: (book: Book) => void;
  isLoading: boolean;
}

const BookList: React.FC<BookListProps> = ({ 
  books, 
  onEdit, 
  onDelete, 
  onView,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-500">No books found</h3>
        <p className="text-gray-400 mt-2">Add a new book to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-blue-50">
            <CardTitle className="line-clamp-2">{book.title}</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p><span className="font-medium">Author:</span> {book.author}</p>
              <p><span className="font-medium">Year:</span> {book.publishedYear}</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onView(book)}
            >
              <BookOpenIcon className="h-4 w-4 mr-1" />
              View
            </Button>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(book)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => onDelete(book)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
