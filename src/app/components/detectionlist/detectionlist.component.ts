import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WildlifeDetection } from '../../interfaces/WildlifeDetection';
import { BehaviorSubject, debounceTime, filter, map, Subject, switchMap, tap } from 'rxjs';
import { WildlifeDetectionApiService } from 'src/app/services/api-services/wildlife-detection-api/wildlife-detection-api.service';


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


export class DetectionlistComponent implements OnInit {
  columnsToDisplay = ['displayDate', 'animalName', 'method', 'total'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: WildlifeDetection | null;

  columnnames = [
    "Date and Time",
    "Species",
    "Method",
    "Total"
  ]

  filterSubj$ = new Subject<string>();

  wildlifeSubj$ = new BehaviorSubject<string | void>(undefined);

  wildlifedata$ = this.wildlifeSubj$.pipe(
    map(f => f ?? ''),
    switchMap((filter) =>
      this.wildlifeApi.getwildlifeData().pipe(map(data => {
        return data.filter(d => d.method.includes(filter)
          || new Date(d.recordedAt).toISOString().includes(filter)
          || d.animalName.includes(filter)
          || String(d.total).includes(filter)
          || String(d.male).includes(filter)
          || String(d.female).includes(filter)
          || String(d.offspring).includes(filter)
          || d.comment?.includes(filter)


        )
      }))
    ),
    map(wildlifedetectionlist => wildlifedetectionlist.map(b => ({ ...b, displayDate: new Date(b.recordedAt).toLocaleString() }))),

  );


  constructor(private wildlifeApi: WildlifeDetectionApiService) {
    this.filterSubj$.pipe(
      debounceTime(200),
      tap(v => this.wildlifeSubj$.next(v)),
    ).subscribe();
  }

  ngOnInit() {
  }

  deleteAnimal(animalId: WildlifeDetection) {
    this.wildlifeApi.deleteAnimal(animalId)
      .subscribe(_ => {
        this.wildlifeApi.invalidateCache();
        this.wildlifeSubj$.next();
      })
  }
}

