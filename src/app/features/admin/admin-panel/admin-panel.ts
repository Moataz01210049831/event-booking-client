import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category, Hall,Location } from '../../../core/modals/admin.models';
import { AdminService } from '../../../core/Services/admin.service';
import { NotificationService } from '../../../core/Services/notification.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanelComponent implements OnInit {
  categories = signal<Category[]>([]);
  locations = signal<Location[]>([]);
  halls = signal<Hall[]>([]);

  categoryForm: FormGroup;
  locationForm: FormGroup;
  hallForm: FormGroup;
  eventForm: FormGroup;
seatsForm: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['']
    });

    this.hallForm = this.fb.group({
      name: ['', Validators.required],
      locationId: ['', Validators.required]
    });

     this.seatsForm = this.fb.group({
      hallId: ['', Validators.required],
      rowLabel: ['', Validators.required],
      seatFrom: [1, [Validators.required, Validators.min(1)]],
      seatTo: [10, [Validators.required, Validators.min(1)]],
      seatType: ['Regular', Validators.required]
    });
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      startDateUtc: ['', Validators.required],
      endDateUtc: ['', Validators.required],
      hallId: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.adminService.getCategories().subscribe(data => this.categories.set(data));
    this.adminService.getLocations().subscribe(data => this.locations.set(data));
    this.adminService.getHalls().subscribe(data => this.halls.set(data));
  }

  submitCategory(): void {
    if (this.categoryForm.invalid) return;
    this.isSubmitting.set(true);

    this.adminService.createCategory(this.categoryForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.showSuccess('تم إضافة التصنيف بنجاح');
        this.categoryForm.reset();
        this.loadAll();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  submitLocation(): void {
    if (this.locationForm.invalid) return;
    this.isSubmitting.set(true);

    this.adminService.createLocation(this.locationForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.showSuccess('تم إضافة المكان بنجاح');
        this.locationForm.reset();
        this.loadAll();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  submitHall(): void {
    if (this.hallForm.invalid) return;
    this.isSubmitting.set(true);

    this.adminService.createHall(this.hallForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.showSuccess('تم إضافة القاعة بنجاح');
        this.hallForm.reset();
        this.loadAll();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  submitEvent(): void {
    if (this.eventForm.invalid) return;
    this.isSubmitting.set(true);

    const formValue = this.eventForm.value;
    const request = {
      ...formValue,
      startDateUtc: new Date(formValue.startDateUtc).toISOString(),
      endDateUtc: new Date(formValue.endDateUtc).toISOString()
    };

    this.adminService.createEvent(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notification.showSuccess('تم إنشاء الحدث بنجاح 🎉');
        this.eventForm.reset();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

   submitSeats(): void {
    if (this.seatsForm.invalid) return;

    const { hallId, rowLabel, seatFrom, seatTo, seatType } = this.seatsForm.value;

    if (seatTo < seatFrom) {
      this.notification.showError('رقم المقعد النهائي لازم يكون أكبر من أو يساوي البداية');
      return;
    }

    const seats = [];
    for (let i = seatFrom; i <= seatTo; i++) {
      seats.push({
        rowLabel,
        seatNumber: i.toString(),
        seatType
      });
    }

    this.isSubmitting.set(true);

    this.adminService.addSeats({ hallId, seats }).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.notification.showSuccess(`تم إضافة ${response.addedCount} مقعد بنجاح`);
        this.seatsForm.patchValue({ rowLabel: '' });
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}