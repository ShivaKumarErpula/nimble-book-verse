
export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export interface ImportResult {
  addedCount: number;
  errors: Array<{
    row: number;
    message: string;
    data?: string;
  }>;
}

export type BookFormData = Omit<Book, 'id'>;
