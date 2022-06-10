import { Icon, IconOptions } from "leaflet";
import * as L from 'leaflet'
import { Position } from "../interfaces/position";

export function getIconWithIconUrl(url: string): Icon<IconOptions> {
    
    let iconSize = 40;

    return L.icon({
        iconUrl: url,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2],
        popupAnchor: [0, 0]
    });
}