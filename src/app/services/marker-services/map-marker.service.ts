import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as L from 'leaflet'
import { debounceTime, Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LocationService } from '../location.service';

interface SearchResult {
    place_id: number;
    address: Address;
    boundingbox: BoundingBox;
    class: string;
    display_name: string;
    icon: string;
    importance: number;
    lat: string;
    lon: string;
    osm_id: number;
    osm_type: string;
    type: string;
    [x: string]: any;
}

interface Address {
    "ISO3166-2lvl4": string;
    city: string;
    country: string;
    country_code: string;
    county: string;
    highway: string;
    postcode: string;
    road: string;
    state: string;
    village: string;
    [x: string]: any;
}

interface BoundingBox {
    0: string;
    1: string;
    2: string;
    3: string;
}

@Injectable({
    providedIn: 'root'
})
export class MapMarkerService {

    constructor(private http: HttpClient,
        private locationService: LocationService,) {
        this.addInputToggle();
        this._addSearchBar();
        this._addLocationInput();
    }

    allowInputMarkers(map: L.Map): void {
        // (L.control as any).toggleInput().addTo(map);
    }

    addSearchBar(mapLeaf: L.Map) {
        (L.control as any).searchbar({ httpClient: this.http }).addTo(mapLeaf);
    }

    addLocationInput(map: L.Map) {
        (L.control as any).locationInput({ locationService: this.locationService }).addTo(map);
    }

    private addInputToggle(): any {

        (L.Control as any).ToggleInput = L.Control.extend({
            options: {
                position: 'topright',
            },
            onAdd: function (map: L.Map) {
                let marker: L.Marker;
                let checked = false;
                var controlDiv = L.DomUtil.create('div');
                var controlUI = L.DomUtil.create('div', 'leaflet-control-toggle', controlDiv);
                controlUI.title = 'Choose Location';
                var label = L.DomUtil.create('label', 'label', controlUI);
                label.innerText = '+';
                const markerAddToggleHandler = (e: L.LeafletMouseEvent) => {
                    if (marker) marker.remove();
                    marker = L.marker(e.latlng).addTo(map);
                    marker.feature = { properties: { isLocationPicker: true }, type: "Feature", geometry: { coordinates: [e.latlng.lat, e.latlng.lng], type: 'Point' } };
                    map.fireEvent('location-picked', e.latlng);
                    marker.on('click', (e: L.LeafletMouseEvent) => {
                        marker.remove();
                        controlUI.classList.remove('leaflet-control-toggle-active');
                        label.innerText = '+';
                    });
                    checked = false;
                    label.innerText = '';
                    label.innerHTML = '&check;';
                }
                L.DomEvent
                    .addListener(label, 'click', L.DomEvent.stopPropagation)
                    .addListener(label, 'click', L.DomEvent.preventDefault)
                    .addListener(label, 'click', function (e: any) {
                        if (!checked) {
                            checked = true;
                            controlUI.classList.add('leaflet-control-toggle-active')
                            map.once('click', markerAddToggleHandler);
                            label.innerText = '+';
                        }
                        checked = !checked
                    });
                return controlDiv;
            }
        });

        (L.control as any).toggleInput = function (options: any) {
            return new (L.Control as any).ToggleInput(options);
        };
    }

    _addSearchBar() {
        (L.Control as any).Searchbar = L.Control.extend({
            options: {
                position: 'topleft',
            },
            onAdd: function (map: L.Map) {
                let subject = new Subject<string>();
                let subscription = new Subscription();
                let resultSubject = new Subject<SearchResult[]>();
                let makeSearchCall = (text: string): Observable<SearchResult[]> => {
                    console.log('Get Request')
                    if (text.length > 0) {
                        return ((this.options as any).httpClient as HttpClient).get<SearchResult[]>('https://nominatim.openstreetmap.org/search?q=' + text + '&format=json&polygon=1&addressdetails=1')
                    } else {
                        return of([]);
                    }
                };

                subscription = subject.pipe(
                    filter(searchText => searchText.length > 2),
                    debounceTime(1100),
                    distinctUntilChanged(),
                ).subscribe(
                    (searchText: string) => {
                        makeSearchCall(searchText).subscribe({
                            next: (res: SearchResult[]) => {
                                resultSubject.next(res);
                            },
                            error: (err: any) => {
                                console.error(err);
                            }
                        }
                        );
                    }
                );

                var controlDiv = L.DomUtil.create('div');
                var controlUI = L.DomUtil.create('div', 'leaflet-control-searchbar', controlDiv);
                controlUI.title = 'Search';
                var input = L.DomUtil.create('input', 'searchbar-input', controlUI);
                var icon = L.DomUtil.create('img', 'searchbar-icon', controlUI);
                icon.src = 'assets/icons/search.png';
                L.DomEvent
                    .addListener(input, 'keyup', L.DomEvent.stopPropagation)
                    .addListener(input, 'keyup', L.DomEvent.preventDefault)
                    .addListener(input, 'keyup', function (e: any) {
                        const searchText = e.target.value;
                        subject.next(searchText);
                    });

                var blur_time: any;
                var resultsDiv = L.DomUtil.create('div', 'search-results', controlUI);
                resultSubject.subscribe(results => {
                    resultsDiv.innerHTML = '';
                    let names: string[] = [];
                    for (const result of results) {
                        if (names.includes(result.display_name) || names.length == 5) {
                            continue;
                        }
                        names.push(result.display_name);
                        let a = L.DomUtil.create('a', 'search-result', resultsDiv);
                        let img = L.DomUtil.create('img', 'search-result-img', a);
                        if (result.icon) {
                            img.src = result.icon;
                        } else {
                            img.src = "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"; //empty image
                            img.alt = ''
                        }
                        let a_span = L.DomUtil.create('span', '', a);
                        a_span.innerText = result.display_name;
                        L.DomEvent
                            .addListener(a, 'click', L.DomEvent.stopPropagation)
                            .addListener(a, 'click', L.DomEvent.preventDefault)
                            .addListener(a_span, 'click', function (e: any) {
                                map.flyToBounds([[+result.boundingbox[0], +result.boundingbox[2]], [+result.boundingbox[1], +result.boundingbox[3]]]);
                                input.innerText = result.display_name;
                                resultsDiv.classList.add('hidden');
                            });
                    }
                });
                L.DomEvent.addListener(input, 'focus', function (e: any) {
                    if (blur_time) clearTimeout(blur_time);
                    resultsDiv.classList.remove('hidden');
                });
                L.DomEvent.addListener(input, 'blur', function (e: any) {
                    blur_time = setTimeout(() => { resultsDiv.classList.add('hidden'); }, 100);

                })
                return controlDiv;
            }
        });

        (L.control as any).searchbar = function (options: any) {
            return new (L.Control as any).Searchbar(options);
        };
    }

    _addLocationInput() {
        (L.Control as any).LocationInput = L.Control.extend({
            options: {
                position: 'bottomright',
            },
            onAdd: function (map: L.Map) {

                var controlDiv = L.DomUtil.create('div');
                var controlUI = L.DomUtil.create('div', 'leaflet-control-toggle', controlDiv);
                controlUI.title = 'Add Data';
                var button = L.DomUtil.create('button', 'mat-mini-fab', controlUI);
                button.setAttribute('mat-mini-fab', '');
                button.setAttribute('color', 'primary');
                button.setAttribute('aria-label', 'Get User Location');
                button.innerHTML = '<mat-icon class="mat-icon notranslate material-icons mat-icon-no-color">location_disabled</mat-icon>';

                var is_active = false;
                const turnLocationOn = () => {
                    ((this.options as any).locationService as LocationService).locate(map);
                }
                const turnLocationOff = () => {
                    ((this.options as any).locationService as LocationService).stopLocaton(map);
                }

                L.DomEvent
                    .addListener(button, 'click', L.DomEvent.stopPropagation)
                    .addListener(button, 'click', L.DomEvent.preventDefault)
                    .addListener(button, 'click', function (e: any) {
                        if (!is_active) {
                            is_active = true;
                            turnLocationOn();
                            button.innerHTML = '<mat-icon class="mat-icon notranslate material-icons mat-icon-no-color">my_location</mat-icon>';
                        } else {
                            is_active = false;
                            button.innerHTML = '<mat-icon class="mat-icon notranslate material-icons mat-icon-no-color">location_disabled</mat-icon>';
                            turnLocationOff()
                        }
                    });


                return controlDiv;
            }
        });

        (L.control as any).locationInput = function (options: any) {
            return new (L.Control as any).LocationInput(options);
        };
    }

}
