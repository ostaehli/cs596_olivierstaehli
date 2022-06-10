export interface RainViewerImagePathResponse{
    version: string,
    generated: number,
    host: string,
    radar: RainViewerRadaObject,
    satellite: RainViewerSatelliteObject,
}

interface RainViewerRadaObject {
    past: TimePath[],
    nowcast: TimePath[]
}

interface RainViewerSatelliteObject {
    infrared: TimePath[]
}

interface TimePath {
    time: Date,
    path: string
}