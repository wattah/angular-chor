import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { NomenclatureVO } from "../models/nomenclature-vo";

@Injectable( {
    providedIn: 'root'
})
export class CatalogComponentService {

    private readonly nameDescriRef$ = new BehaviorSubject('');
    private readonly nameClature1$ = new BehaviorSubject(null);
    private readonly nameClature2$ = new BehaviorSubject(null);
    private readonly nameClature3$ = new BehaviorSubject(null);
    private readonly nameClature4$ = new BehaviorSubject(null);
    private readonly nameClature5$ = new BehaviorSubject(null);

    constructor() {}

    /**
     * getter and setter 
     */
    setNameDescriRef(val: string): void {
        this.nameDescriRef$.next(val);
    }

    getNameDescriRef(): BehaviorSubject<string> {
        return this.nameDescriRef$;
    }

    setNameClature1(val: NomenclatureVO): void {
        this.nameClature1$.next(val);
    }

    getNameClature1(): BehaviorSubject<NomenclatureVO> {
        return this.nameClature1$;
    }

    setNameClature2(val: NomenclatureVO): void {
        this.nameClature2$.next(val);
    }

    getNameClature2(): BehaviorSubject<NomenclatureVO> {
        return this.nameClature2$;
    }

    setNameClature3(val: NomenclatureVO): void {
        this.nameClature3$.next(val);
    }

    getNameClature3(): BehaviorSubject<NomenclatureVO> {
        return this.nameClature3$;
    }

    setNameClature4(val: NomenclatureVO): void {
        this.nameClature4$.next(val);
    }

    getNameClature4(): BehaviorSubject<NomenclatureVO> {
        return this.nameClature4$;
    }

    setNameClature5(val: NomenclatureVO): void {
        this.nameClature5$.next(val);
    }

    getNameClature5(): BehaviorSubject<NomenclatureVO> {
        return this.nameClature5$;
    }

    /**
     * end getter setter
     */

}