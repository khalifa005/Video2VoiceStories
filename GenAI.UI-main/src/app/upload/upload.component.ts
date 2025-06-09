import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
   providers: [HttpClient],
})
export class UploadComponent{
  form: FormGroup;
  isDragging = false
  selectedFile: File | null = null
  apiKey = ""
  // outputType = "userStories"
  // additionalInstructions = ""
  generatedContent = ""

   constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      file: [null],
  outputType: ['userStories'],
  additionalInstructions: ['']
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = true
  }

  onDragLeave() {
    this.isDragging = false
  }

  onDropx(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0]
      console.log("File selected:", this.selectedFile.name)
    }
  }

  onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;

  if (event.dataTransfer?.files.length) {
    const droppedFile = event.dataTransfer.files[0];
    this.selectedFile = droppedFile;
    console.log("File selected:", droppedFile.name);

    // 🔥 Update the reactive form control too!
    this.form.patchValue({ file: droppedFile });
  }
}


  onFileSelected(event: Event) {     
     const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.form.patchValue({ file: fileInput.files[0] });
    }
  }

   removeFile(): void {
    this.selectedFile = null;    
  }

  generateContent() {     
    if (!this.form || !this.form.value.file) return;

    const formData = new FormData();
    formData.append('file', this.form.value.file);
    formData.append('outputType', this.form.value.outputType);

    // this.loading = true;

    this.http.post<{ content: string }>('https://localhost:7234/Upload', formData).subscribe({
      next: (res) => {
        this.generatedContent = res.content;
        // this.loading = false;
      },
      error: () => {
        alert('Error generating content');
        // this.loading = false;
      }
    }); 
    // Simulate loading
    this.generatedContent = "Processing..." 
  }
}