import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class storageService {
  private storage: Storage | null = null;

  constructor() {
    this.storage = window.localStorage;
  }

  async remove(key: string): Promise<boolean> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  async set(key: string, value: any): Promise<boolean> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  async reloadStorageIfNull() {
    if (this.storage == undefined || this.storage == null) {
      this.storage = window.localStorage;
    }
  }  

  async get(key: string): Promise<any> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      const obj = this.storage.getItem(key);
      return obj ? JSON.parse(obj) : null;
    }
    return null;
  }

  async clear(): Promise<boolean> {
    await this.reloadStorageIfNull();
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }
  
}
