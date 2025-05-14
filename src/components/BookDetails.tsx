
import React from 'react';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center justify-between">
          <span>{book.title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Author</h3>
            <p className="text-lg">{book.author}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Published Year</h3>
            <p className="text-lg">{book.publishedYear}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">ID</h3>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{book.id}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          onClick={() => onEdit(book)}
          className="flex items-center"
        >
          <PencilIcon className="h-4 w-4 mr-2" /> Edit Book
        </Button>
        
        <Button
          variant="outline"
          className="text-red-500 hover:bg-red-50 hover:text-red-700 flex items-center"
          onClick={() => onDelete(book)}
        >
          <TrashIcon className="h-4 w-4 mr-2" /> Delete Book
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookDetails;
