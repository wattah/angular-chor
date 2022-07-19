import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class BillDownloadService{
    files: string[] = [];
}