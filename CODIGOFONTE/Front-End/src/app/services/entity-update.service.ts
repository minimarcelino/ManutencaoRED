import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityUpdateService {

  private subjects: { [key: string]: Subject<void> } = {};

  getUpdateNotifier(entity: string) {
    if (!this.subjects[entity]) {
      this.subjects[entity] = new Subject<void>();
    }
    return this.subjects[entity].asObservable();
  }

  notifyUpdate(entity: string) {
    if (!this.subjects[entity]) {
      this.subjects[entity] = new Subject<void>();
    }
    this.subjects[entity].next();
  }
}