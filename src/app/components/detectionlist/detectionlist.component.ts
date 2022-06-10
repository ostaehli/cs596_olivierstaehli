import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WildlifeDetection } from '../../interfaces/WildlifeDetection';
import { BehaviorSubject, debounceTime, map, Subject, tap } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManualreportingComponent } from '../manualreporting/manualreporting.component';


@Component({
  selector: 'app-detectionlist',
  templateUrl: './detectionlist.component.html',
  styleUrls: ['./detectionlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class DetectionlistComponent implements OnInit, OnDestroy {
  @ViewChild('input') filterInput: ElementRef<HTMLInputElement>;
  columnsToDisplay = ['displayDate', 'animalName', 'method', 'total'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: WildlifeDetection | null;

  columnnames = [
    "Date and Time",
    "Species",
    "Method",
    "Total"
  ]

  deleted: WildlifeDetection[] = [];
  flyToMarker: L.Marker | undefined;
  filterSubj$ = new Subject<string>();

  wildlifeSubj$ = new BehaviorSubject<string | void>(undefined);

  wildlifedata$ = this.wildlifeSubj$.pipe(
    map(f => f ?? ''),
    map((filter) =>
      this.wld.map(w => w.feature!.properties).filter(d => d.method.includes(filter)
        || new Date(d.recordedAt).toISOString().includes(filter)
        || d.animalName.includes(filter)
        || String(d.total).includes(filter)
        || String(d.male).includes(filter)
        || String(d.female).includes(filter)
        || String(d.offspring).includes(filter)
        || d.comment?.includes(filter)
      )
    ),
    map(wildlifedetectionlist => wildlifedetectionlist.map(b => ({ ...b, displayDate: new Date(b.recordedAt).toLocaleString() }))),

  );


  constructor(@Inject(MAT_DIALOG_DATA) private wld: L.Marker<WildlifeDetection>[],
    private dialogRef: MatDialogRef<ManualreportingComponent>) {
    this.filterSubj$.pipe(
      debounceTime(200),
      tap(v => this.wildlifeSubj$.next(v)),
    ).subscribe();
  }

  ngOnInit() {
    this.wld.filter(w => w.feature)
  }

  ngOnDestroy() {
    this.dialogRef.close({delete: this.deleted, flyTo: this.flyToMarker})
  }

  deleteAnimal(animal: WildlifeDetection) {
    this.wld = this.wld.filter(d => d.feature?.properties.id !== animal.id);
    this.deleted.push(animal);
    this.filterSubj$.next('');
    this.filterInput.nativeElement.value = "";
  }

  flyTo(event: WildlifeDetection){
    this.flyToMarker =this.wld.find(e => event.id === e.feature?.properties.id);
  
    this.dialogRef.close()
  }
}

