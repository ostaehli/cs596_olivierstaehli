import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { map, Observable, of, startWith, tap } from 'rxjs';
import { Animal } from 'src/app/interfaces/animal';
import { Report } from 'src/app/interfaces/report';
import { WildlifeDetectionApiService } from 'src/app/services/api-services/wildlife-detection-api/wildlife-detection-api.service';
import { PublicApiService } from 'src/app/services/api-services/public-api/public-api.service';


@Component({
  selector: 'app-manualreporting',
  templateUrl: './manualreporting.component.html',
  styleUrls: ['./manualreporting.component.scss']
})
export class ManualreportingComponent implements OnInit {

  reportForm = new FormGroup({
    species: new FormControl('', [Validators.required]),
    method: new FormControl('', [Validators.required]),
    total: new FormControl(1, [Validators.required]),
    females: new FormControl(0, []),
    males: new FormControl(0, []),
    offspring: new FormControl(0, []),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required])
  });

  detectionMethods$ = this.publicApi.getDetectionMethods().pipe(map(methods => methods.filter(m => !m.includes("SMART_"))));
  species$ = this.publicApi.getAnimals().pipe(tap(d => this.species = d));
  species: Animal[];

  loading = false;

  filteredOptions$: Observable<Animal[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { lat: number, lng: number },
  private dialogRef: MatDialogRef<ManualreportingComponent>, 
  private detectionApi: WildlifeDetectionApiService, 
  private publicApi: PublicApiService) { }

  selectedFile = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.filteredOptions$ = this.reportForm.get("species")?.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(v => v.toLowerCase()),
      map(name => (name ? this.filter(name) : this.species.slice())),
    ) || of([]);
    this.reportForm.get("location")?.setValue(this.data);
  }

  onSave() {
    const values = this.reportForm.value;
    const date = new Date(this.reportForm.value.date)
    date.setHours(values.time.split(":")[0])
    date.setMinutes(values.time.split(":")[1])
    let report: Report = {
      animalId: values.species.id,
      method: values.method,
      detectedAt: date.toISOString(),
      locationLat: values.location.lat,
      locationLong: values.location.lng,
      total: values.total,
      male: values.males,
      female: values.females,
      offspring: values.offspring,
      comment: values.comment
    }

    this.loading = true;
    this.detectionApi.createDetection(report).subscribe(m => {
      this.dialogRef.close(m);
      this.loading = false;
    });
  }


  displayFn(species: Animal): string {
    return species.name;
  }

  private filter(name: string): Animal[] {
    return this.species.filter(o => o.name.toLowerCase().includes(name))
  }

}
