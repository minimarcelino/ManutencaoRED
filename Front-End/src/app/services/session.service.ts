import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class sessionService {
    constructor() { }

    setSession(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getSession() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    clearSession() {
        localStorage.removeItem('user');
    }
}