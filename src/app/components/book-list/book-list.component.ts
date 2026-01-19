import { Component, OnInit, signal, computed } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../auth/auth.service';
import { Book } from '../../models/book.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books = signal<Book[]>([]);
  filterText = signal('');

  //Filtravimas pagal pavadinimą, ISBN ARBA autorių
  filteredBooks = computed(() => {
    const query = this.filterText().toLowerCase();
    return this.books().filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.isbn.includes(query) ||
      b.authors.some(author => 
        author.name.toLowerCase().includes(query) || 
        author.surname.toLowerCase().includes(query)
      )
    );
  });

  constructor(public bookService: BookService, public authService: AuthService) {}

  ngOnInit() { this.load(); }

  load() {
    this.bookService.getBooks().subscribe(res => this.books.set(res));
  }

  onDelete(id: string) {
    if (confirm('Ištrinti knygą?')) {
      this.bookService.deleteBook(id).subscribe(() => this.load());
    }
  }

  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }
}