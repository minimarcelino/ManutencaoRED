import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityUpdateService {
  private entityUpdateSources: { [key: string]: BehaviorSubject<boolean> } = {};

  getUpdateNotifier(entityName: string): Observable<boolean> {
    if (!this.entityUpdateSources[entityName]) {
      this.entityUpdateSources[entityName] = new BehaviorSubject<boolean>(false);
    }
    return this.entityUpdateSources[entityName].asObservable();
  }

  notifyUpdate(entityName: string) {
    if (!this.entityUpdateSources[entityName]) {
      this.entityUpdateSources[entityName] = new BehaviorSubject<boolean>(false);
    }
    this.entityUpdateSources[entityName].next(true);
  }
  
}
