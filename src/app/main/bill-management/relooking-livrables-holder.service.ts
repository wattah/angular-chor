import { LivrableVO } from './../../_core/models/livrable-vo';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class RelookingLivrablesHolder {
    toRelookingLivrables: Array<LivrableVO> = [];
}