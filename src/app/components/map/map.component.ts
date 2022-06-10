import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapMarkerService } from 'src/app/services/marker-services/map-marker.service';
import { RainviewermapService, GeoadminmapService } from 'src/app/services/api-services/index';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ManualreportingComponent } from 'src/app/components/manualreporting/manualreporting.component';
import { LocationService } from 'src/app/services/location.service';
import { DetectionlistComponent } from '../detectionlist/detectionlist.component';
import { AdddeviceComponent } from '../adddevice/adddevice.component';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { WildlifeDetectionApiService } from 'src/app/services/api-services/wildlife-detection-api/wildlife-detection-api.service';
import { map } from 'rxjs/operators';
import { WildlifeDetection } from 'src/app/interfaces/WildlifeDetection';
import { Box } from 'src/app/interfaces/box';
import { mapToSeason } from 'src/app/utils/mont-to-season.mapper';
import { BoxMarkerService } from 'src/app/services/marker-services/box-marker.service';
import { BoxApiService } from 'src/app/services/api-services/box-api/box-api.service';
import { DetectionMarkerService } from 'src/app/services/marker-services/detection-marker.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {

    private destroy$ = new Subject<void>();
    private map: L.Map | undefined;

    pickingFlag = false;

    filterState = {
        showDevices: true,
        showDetections: true,
        speciesChosen: [] as string[],
        timesChosen: [] as string[],
        monitoringChosen: [] as string[]
    }

    boxMarkerLayer: L.LayerGroup = L.layerGroup();
    detectionMarkerLayer: L.LayerGroup = L.layerGroup();

    private boxMarkers: L.Circle<Box>[];
    private detectionMarkers: L.Marker<WildlifeDetection>[];


    speciesSubj$ = new BehaviorSubject<void>(undefined);
    timeSubj$ = new BehaviorSubject<void>(undefined);
    monitoringMethodSubj$ = new BehaviorSubject<void>(undefined);
    mapMarkerSubj$ = new BehaviorSubject<void>(undefined);

    species$ = this.speciesSubj$.pipe(
        switchMap(_ => this.wildlifeApi.getwildlifeData()),
        map(data => data.map(d => d.animalName)),
        map(data => [...new Set(data)]),
        map(spec => spec.map(m => ({ name: m, chosen: false })))
    )

    time$ = this.timeSubj$.pipe(
        switchMap(_ => this.wildlifeApi.getwildlifeData()),
        map(data => data.map(d => d.recordedAt)),
        map(dates => dates.map(d => new Date(d).getMonth())),
        map(dates => dates.map(mapToSeason)),
        map(data => [...new Set(data)]),
        map(spec => spec.map(m => ({ name: m, chosen: false })))
    )

    monitoringMethod$ = this.monitoringMethodSubj$.pipe(
        switchMap(_ => this.wildlifeApi.getwildlifeData()),
        map(data => data.map(d => d.method)),
        map(data => [...new Set(data)]),
        map(spec => spec.map(m => ({ name: m, chosen: false })))
    )

    detectionMarkers$ = this.mapMarkerSubj$.pipe(
        switchMap(_ => this.wildlifeApi.getwildlifeData()),
        map(dts => this.detectionMarker.createMarkers(dts)),
        tap(d => this.detectionMarkers = d),
        tap(markers => markers.forEach(m => this.detectionMarkerLayer.addLayer(m))),
    )

    boxMarkers$ = this.mapMarkerSubj$.pipe(
        switchMap(_ => this.boxApi.getBoxes()),
        map(bs => this.boxMarker.createMarkers(bs)),
        tap(d => this.boxMarkers = d),
        tap(markers => markers.forEach(m => this.boxMarkerLayer.addLayer(m))),
    )


    constructor(private mapMarkerService: MapMarkerService,
        private rainviewermapService: RainviewermapService,
        private geoadminmapService: GeoadminmapService,
        private locateService: LocationService,
        private dialogRef: MatDialog,
        private authService: AuthenticationService,
        private wildlifeApi: WildlifeDetectionApiService,
        private boxMarker: BoxMarkerService,
        private boxApi: BoxApiService,
        private detectionMarker: DetectionMarkerService
    ) { }

    ngOnInit() {
        this.resetComplexFilters();

    }

    openDialogReport(lat: number, lng: number) {
        this.dialogRef.open(ManualreportingComponent, { data: { lat, lng } }).afterClosed().subscribe(d => {
            if (!d) return;
            this.wildlifeApi.invalidateCache();
            this.mapMarkerSubj$.next();
            this.resetComplexFilters();
        });
        this.pickingFlag = false;
    }

    pickLocation() {
        if (!this.pickingFlag) {
            this.map?.once('click', (e: L.LeafletMouseEvent) => { if (this.pickingFlag) this.openDialogReport(e.latlng.lat, e.latlng.lng) })
        }
        this.pickingFlag = !this.pickingFlag;
    }

    openDialogDevice() {
        this.dialogRef.open(AdddeviceComponent)
    }

    openDialogDetectionlist() {
        this.dialogRef.open(DetectionlistComponent).afterClosed().subscribe(e => {
            this.detectionMarkers.forEach(m => this.detectionMarkerLayer.removeLayer(m))
            this.mapMarkerSubj$.next();
            this.resetComplexFilters()
        });
    }

    isShowFilter = true;

    displayFilterOptions() {
        this.isShowFilter = !this.isShowFilter;
    }

    onFilterChange(filterList: string[], st: string) {
        let contains = filterList.filter(s => st !== s);
        if (contains.length < filterList.length) {
            filterList.splice(0, filterList.length);
            contains.forEach(a => filterList.push(a))
        } else {
            filterList.push(st);
        }
        this.applyFilter();
    }

    toggleLayer(flagName: string, flag: boolean, layer: L.LayerGroup) {
        if (flag) {
            layer.remove()
        } else {
            layer.addTo(this.map ?? this.initMap())
        }
        (this.filterState as { [key: string]: any })[flagName] = !flag;
    }

    ngAfterViewInit(): void {
        this.initMap()
        if (this.map) {
            let layerControl = L.control.layers(undefined, undefined, { position: 'bottomleft' });
            layerControl.addTo(this.map);
            this.rainviewermapService.init(layerControl);
            this.geoadminmapService.init(layerControl);
            this.mapMarkerService.allowInputMarkers(this.map);
            this.mapMarkerService.addSearchBar(this.map);
            this.mapMarkerService.addLocationInput(this.map);

            this.boxMarkers$.subscribe();
            this.detectionMarkers$.subscribe();
            this.mapMarkerSubj$.next();

        }
    }

    logout(): void {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.locateService.stopLocaton(this.map);
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    clearFilter() {
        this.filterState = this.getInitialState();
        this.boxMarkerLayer.addTo(this.map || this.initMap());
        this.detectionMarkerLayer.addTo(this.map || this.initMap());
        this.resetComplexFilters();
        this.applyFilter();
    }
    private applyFilter() {
        this.detectionMarkerLayer.clearLayers();
        let l = this.detectionMarkers;
        l = this.filterState.speciesChosen.length === 0 ? l : this.applySpecies(l);
        l = this.filterState.timesChosen.length === 0 ? l : this.applyTime(l);
        l = this.filterState.monitoringChosen.length === 0 ? l : this.applyMonitoring(l);
        l.forEach(m => this.detectionMarkerLayer.addLayer(m));
    }
    private applySpecies(list: L.Marker<WildlifeDetection>[]) {
        return list.filter(m => this.filterState.speciesChosen.indexOf(m.feature?.properties.animalName ?? "") !== -1);
    }
    private applyTime(list: L.Marker<WildlifeDetection>[]) {
        return list.filter(m => this.filterState.timesChosen.indexOf(mapToSeason(new Date(m.feature?.properties.recordedAt || -1).getMonth())) !== -1);
    }
    private applyMonitoring(list: L.Marker<WildlifeDetection>[]) {
        return list.filter(m => this.filterState.monitoringChosen.indexOf(m.feature?.properties.method ?? "") !== -1);
    }

    private getInitialState() {
        return {
            showDevices: true,
            showDetections: true,
            speciesChosen: [] as string[],
            timesChosen: [] as string[],
            monitoringChosen: [] as string[]
        }
    }

    private resetComplexFilters() {
        this.speciesSubj$.next();
        this.timeSubj$.next();
        this.monitoringMethodSubj$.next();
    }



    private initMap(): L.Map {
        this.map = L.map('map', {
            crs: L.CRS.EPSG3857,
            center: [46.801111, 8.226667],
            zoom: 9,
            maxZoom: 16,
            zoomControl: false
        });


        new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);
        //L.control.locate().addTo(this.map);

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);
        this.detectionMarkerLayer.addTo(this.map);
        this.boxMarkerLayer.addTo(this.map);

        return this.map;
    }
}
