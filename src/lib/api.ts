
import { Book, BookFormData, ImportResult } from "./types";

// In a real application, this would be loaded from an environment variable
const API_URL = "https://mockcrud-api.onrender.com/books";

// Simulated backend since we're just building the frontend for demonstration
const booksStore: Book[] = [
  { id: "1", title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008 },
  { id: "2", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", publishedYear: 2017 },
  { id: "3", title: "The Pragmatic Programmer", author: "Andy Hunt & Dave Thomas", publishedYear: 1999 },
  { id: "4", title: "Refactoring", author: "Martin Fowler", publishedYear: 1999 },
];

export async function getBooks(): Promise<Book[]> {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(booksStore);
    }, 300);
  });
}

export async function getBook(id: string): Promise<Book | undefined> {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(booksStore.find((book) => book.id === id));
    }, 300);
  });
}

export async function createBook(bookData: BookFormData): Promise<Book> {
  // Simulate API request
  return new Promise((resolve) => {
    const newBook = {
      id: Math.random().toString(36).substring(2, 11),
      ...bookData,
    };
    booksStore.push(newBook);
    setTimeout(() => {
      resolve(newBook);
    }, 300);
  });
}

export async function updateBook(id: string, bookData: BookFormData): Promise<Book> {
  // Simulate API request
  return new Promise((resolve, reject) => {
    const index = booksStore.findIndex((book) => book.id === id);
    if (index === -1) {
      reject(new Error("Book not found"));
      return;
    }
    
    const updatedBook = {
      id,
      ...bookData,
    };
    
    booksStore[index] = updatedBook;
    
    setTimeout(() => {
      resolve(updatedBook);
    }, 300);
  });
}

export async function deleteBook(id: string): Promise<void> {
  // Simulate API request
  return new Promise((resolve, reject) => {
    const index = booksStore.findIndex((book) => book.id === id);
    if (index === -1) {
      reject(new Error("Book not found"));
      return;
    }
    
    booksStore.splice(index, 1);
    
    setTimeout(() => {
      resolve();
    }, 300);
  });
}

export async function importBooks(file: File): Promise<ImportResult> {
  // Simulate CSV parsing and validation
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== "string") {
        resolve({
          addedCount: 0,
          errors: [{ row: 0, message: "Failed to read file" }],
        });
        return;
      }
      
      const content = event.target.result;
      const lines = content.split("\n").filter(line => line.trim() !== "");
      const header = lines[0].split(",");
      
      // Validate header
      if (!headerIsValid(header)) {
        resolve({
          addedCount: 0,
          errors: [{ row: 0, message: "Invalid CSV header", data: lines[0] }],
        });
        return;
      }
      
      const errors: Array<{ row: number; message: string; data?: string }> = [];
      let addedCount = 0;
      
      // Process each line (skip header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.split(",");
        
        // Validate row
        if (values.length !== header.length) {
          errors.push({
            row: i,
            message: "Invalid number of fields",
            data: line,
          });
          continue;
        }
        
        // Create book data from row
        try {
          const book: BookFormData = {
            title: values[0].trim(),
            author: values[1].trim(),
            publishedYear: parseInt(values[2].trim()),
          };
          
          // Validate book data
          if (!book.title) {
            throw new Error("Title is required");
          }
          
          if (!book.author) {
            throw new Error("Author is required");
          }
          
          if (isNaN(book.publishedYear) || book.publishedYear <= 0) {
            throw new Error("Published year must be a positive number");
          }
          
          // Add book to store
          const newBook = {
            id: Math.random().toString(36).substring(2, 11),
            ...book,
          };
          
          booksStore.push(newBook);
          addedCount++;
        } catch (error) {
          errors.push({
            row: i,
            message: error instanceof Error ? error.message : "Unknown error",
            data: line,
          });
        }
      }
      
      resolve({
        addedCount,
        errors,
      });
    };
    
    reader.onerror = () => {
      resolve({
        addedCount: 0,
        errors: [{ row: 0, message: "Failed to read file" }],
      });
    };
    
    reader.readAsText(file);
  });
}

function headerIsValid(header: string[]): boolean {
  const requiredFields = ["title", "author", "publishedYear"];
  const normalizedHeader = header.map(h => h.toLowerCase().trim());
  
  return requiredFields.every(field => 
    normalizedHeader.includes(field.toLowerCase())
  );
}
