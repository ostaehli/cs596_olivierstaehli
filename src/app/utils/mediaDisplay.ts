import { Position } from '../interfaces/position';
import { WildlifeDetection } from '../interfaces/WildlifeDetection';

export function getMediaDisplayHTML(data: WildlifeDetection) {
    let mediaDisplayHTML = '';
    if (data.mediaType === 'img') {
        mediaDisplayHTML = `<img src="${data.media}" class="popup-image" alt="${data.animalName}">`;
    } else if (data.audio) {
        mediaDisplayHTML = `<audio controls><source src="${data.audio}" type="audio/mpeg"></audio>
        <img src="${data.spectrogram}" class="popup-image" alt="${data.animalName}">`;
    }
    return mediaDisplayHTML;
}
