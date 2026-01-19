export interface Author {
  name: string;
  surname: string;
}

export interface Book {
  id?: string;
  title: string;
  pages: number;
  isbn: string;
  short_description: string;
  authors: Author[];
}