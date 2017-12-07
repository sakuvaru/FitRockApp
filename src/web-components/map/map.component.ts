import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';
import { AgmMap } from '@agm/core';

@Component({
    selector: 'map',
    templateUrl: 'map.component.html'
})
export class MapComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Google API Key, required for geolocation services
     */
    @Input() apiKey: string;

    /**
     * Address. If only address is provided, lng & lat will be loaded using geolocation service.
     */
    @Input() address: string;

    /**
     * Longitude. If set along with lat, it will be used instead of address
     */
    @Input() lng: number;

    /**
     * Latitude. If set along with lng, it will be used instead of address
     */
    @Input() lat: number;

    /**
     * Enables or disables zoom control
     */
    @Input() zoomControl: boolean = true;

    /**
     * The zoom level of the map
     */
    @Input() zoom: number = 14;

    /**
     * Enables/disables if map is draggable
     */
    @Input() mapDraggable: boolean = true;

    /**
     * If false, disables scrollwheel zooming on the map
     */
    @Input() scrollWheel: boolean = false;

    /**
     * Height of the map
     */
    @Input() height: number;

    /* 
    * It is really important that you define a height component `agm-map`. 
    * Otherwise, you won't see a map on the page! 
    */
    private defaultHeight: number = 300;

    /**
     * Indicates if map ready has been subscibed to
     */
    private mapReadySubscribed: boolean = false;

    @ViewChild(AgmMap) agmMap: AgmMap;

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    ngOnInit() {
        this.initMap();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initMap();
    }

    private initMap(): void {
        if (!this.mapReadySubscribed) {
            this.agmMap.mapReady
                .map(() => {
                    // this fixes an issue where the map would render grey when switching 
                    // between components. 
                    this.agmMap.triggerResize();
                })
                .takeUntil(this.ngUnsubscribe)
                .subscribe();
        }

        if (!this.lat || !this.lng) {
            // try loading coordinates from address
            this.loadCoordinatesFromAddress();
        }
    }

    private loadCoordinatesFromAddress(): void {
        if (!this.apiKey) {
            console.warn('Cannot load coordinates because no api key was provided');
            return;
        }

        if (!this.address) {
            console.warn('Cannot load coordinates because address is not provided');
        }

        this.http.get(this.getGeocodeUrl())
            .map(data => {
                const response = data as GeolocationResponse;
                if (response && response.results && response.results.length > 0) {
                    // take first result only
                    const result = response.results[0];
                    if (result.geometry && result.geometry.location) {
                        this.lat = result.geometry.location.lat;
                        this.lng = result.geometry.location.lng;
                    }
                } else {
                    // address was not found
                    console.warn(`Address '${this.address}' was not found`);
                }
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private getGeocodeUrl(): string {
        return `https://maps.googleapis.com/maps/api/geocode/json?address=${this.address}&key=${this.apiKey}`;
    }
}

class GeolocationResponse {
    public results: Result[];
}

class Result {
    public geometry: Geometry;
}

class Geometry {
    public location: Location;
}

class Location {
    public lng: number;
    public lat: number;
}
