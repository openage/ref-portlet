// import { AgmMap } from '@agm/core';
import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';

@Component({
  selector: 'insight-google-map-widget',
  templateUrl: './google-map-widget.component.html',
  styleUrls: ['./google-map-widget.component.css']
})
export class GoogleMapComponent extends InsightWidgetBaseComponent {

  @Input()
  zoomInput = 5;

  @Output()
  zoom: EventEmitter<number> = new EventEmitter();

  mapItems = [];

  mapTypeControl: true;
  disableDefaultUI: true;

  currentPosition: any;

  lat: number;
  lng: number;

  // @ViewChild(AgmMap)
  // public agmMap: AgmMap;

  headArray = [];
  constructor(injector: Injector) {
    super(injector);
    // this.afterInitialization = () => {
    //   this.headArray = this.reportType.columns.map((c) => c.key);
    // };
    this.afterProcessing = () => {
      if (navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.lng = pos.coords.longitude;
          this.lat = pos.coords.latitude;
        });
      }
      this.setMapData(this.items);
    };
  }

  setMapData(items) {
    this.mapItems = [];
    items.forEach((item) => {
      if ((item.label === 0) || (item.label === '*')) {
        item.label = '';
      }
      const newItem = {
        longitude: item.longitude,
        latitude: item.latitude,
        icon: this.getIconURL(item.icon),
        label: item.label.toString(),
        companyName: item.company
      };
      this.mapItems.push(newItem);
    });
  }

  getIconURL(item) {
    let icon;
    switch (item) {
      case 'pointer':
        icon = {
          url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png',
          height: 43,
          width: 27
        };
        return icon;
      case 'collection':
        icon = {
          url: 'http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png',
          height: 40,
          width: 40
        };
        return icon;
      default:
        icon = {
          url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png',
          height: 43,
          width: 27
        };
        return icon;
    }
  }

  zoomChangeNumber(value) {
    this.zoom.emit(value);
  }

}
