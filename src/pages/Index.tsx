
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Header from '@/components/Header';
import BookList from '@/components/BookList';
import BookForm from '@/components/BookForm';
import BookDetails from '@/components/BookDetails';
import CSVImport from '@/components/CSVImport';

import { getBooks, createBook, updateBook, deleteBook } from '@/lib/api';
import { Book, BookFormData } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { PlusIcon, UploadIcon, FileTextIcon } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'details'>('list');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const newBook = await createBook(bookData);
      setBooks(prev => [...prev, newBook]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    }
  };

  const handleUpdateBook = async (bookData: BookFormData) => {
    if (!selectedBook) return;
    
    try {
      const updatedBook = await updateBook(selectedBook.id, bookData);
      setBooks(prev => 
        prev.map(book => book.id === updatedBook.id ? updatedBook : book)
      );
      setIsEditDialogOpen(false);
      
      // If currently viewing the book details, update the selected book
      if (activeView === 'details') {
        setSelectedBook(updatedBook);
      }
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    
    try {
      await deleteBook(selectedBook.id);
      setBooks(prev => prev.filter(book => book.id !== selectedBook.id));
      setIsDeleteDialogOpen(false);
      
      // If currently viewing the book that was deleted, go back to the list view
      if (activeView === 'details') {
        setActiveView('list');
      }
      
      toast({
        title: "Book Deleted",
        description: `"${selectedBook.title}" has been deleted.`,
      });
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setActiveView('details');
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDeletePrompt = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleBackToList = () => {
    setActiveView('list');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="books" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <TabsList>
              <TabsTrigger value="books" className="flex items-center">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Books
              </TabsTrigger>
              {/* Additional tabs could go here in the future */}
            </TabsList>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              {activeView === 'list' && (
                <>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Book
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <BookForm 
                        onSubmit={handleAddBook}
                        onCancel={() => setIsAddDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <CSVImport 
                        onSuccess={() => {
                          setIsImportDialogOpen(false);
                          loadBooks();
                        }}
                        onCancel={() => setIsImportDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
          
          <TabsContent value="books" className="mt-0">
            {activeView === 'list' ? (
              <BookList 
                books={books}
                isLoading={isLoading}
                onEdit={handleEditBook}
                onDelete={handleDeletePrompt}
                onView={handleSelectBook}
              />
            ) : (
              selectedBook && (
                <BookDetails 
                  book={selectedBook}
                  onBack={handleBackToList}
                  onEdit={handleEditBook}
                  onDelete={handleDeletePrompt}
                />
              )
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Book Management API - Node.js Interview Task
        </div>
      </footer>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {selectedBook && (
            <BookForm 
              initialData={selectedBook}
              onSubmit={handleUpdateBook}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-semibold">
                {selectedBook?.title}
              </span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBook} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
