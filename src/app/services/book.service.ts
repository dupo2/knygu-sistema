import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Book } from '../models/book.model';
import { map, firstValueFrom, take, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly url = 'https://knygu-sistema-default-rtdb.europe-west1.firebasedatabase.app/books';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBooks() {
    return this.http.get<{ [key: string]: Book }>(`${this.url}.json`).pipe(
      map(data => {
        const books: Book[] = [];
        for (const key in data) {
            const authors = data[key].authors || []; 
            books.push({ ...data[key], id: key, authors: authors });
        }
        return books.sort((a, b) => a.title.localeCompare(b.title));
      })
    );
  }

  async isIsbnUnique(isbn: string, excludeId?: string): Promise<boolean> {
    const books = await firstValueFrom(this.getBooks());
    return !books.some(b => b.isbn === isbn && b.id !== excludeId);
  }

  private getToken() {
    return this.authService.user.pipe(
      take(1),
      map(user => user ? user.token : null)
    );
  }

  addBook(book: Book) {
    return this.getToken().pipe(
      switchMap(token => {
        return this.http.post(`${this.url}.json`, book, {
            params: new HttpParams().set('auth', token || '')
        });
      })
    );
  }

  updateBook(id: string, book: Book) {
    return this.getToken().pipe(
        switchMap(token => {
          return this.http.put(`${this.url}/${id}.json`, book, {
              params: new HttpParams().set('auth', token || '')
          });
        })
      );
  }

  deleteBook(id: string) {
    return this.getToken().pipe(
        switchMap(token => {
          return this.http.delete(`${this.url}/${id}.json`, {
              params: new HttpParams().set('auth', token || '')
          });
        })
      );
  }

  getBook(id: string) { return this.http.get<Book>(`${this.url}/${id}.json`); }
}