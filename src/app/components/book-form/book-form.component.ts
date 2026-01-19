import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  editId: string | null = null;
  isbnError = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      pages: [null, [Validators.required, Validators.min(1)]],
      isbn: ['', Validators.required],
      short_description: ['', Validators.required],
      authors: this.fb.array([])
    });
  }

  get authors() { return this.bookForm.get('authors') as FormArray; }

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.bookService.getBook(this.editId).subscribe(book => {
        if (book) {
          this.bookForm.patchValue(book);
          book.authors.forEach(a => this.addAuthor(a));
        }
      });
    } else {
      this.addAuthor();
    }
  }

  addAuthor(data?: {name: string, surname: string}) {
    const group = this.fb.group({
      name: [data?.name || '', Validators.required],
      surname: [data?.surname || '', Validators.required]
    });
    this.authors.push(group);
  }

  removeAuthor(index: number) { this.authors.removeAt(index); }

  async onSubmit() {
    if (this.bookForm.invalid) return;

    const isbn = this.bookForm.value.isbn;
    const isUnique = await this.bookService.isIsbnUnique(isbn, this.editId || undefined);

    if (!isUnique) {
      this.isbnError = true;
      return;
    }

    if (this.editId) {
      this.bookService.updateBook(this.editId, this.bookForm.value)
        .subscribe(() => this.router.navigate(['/list']));
    } else {
      this.bookService.addBook(this.bookForm.value)
        .subscribe(() => this.router.navigate(['/list']));
    }
  }
}