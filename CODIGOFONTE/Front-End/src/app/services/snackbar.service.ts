import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(
    public snackBar: MatSnackBar
  ) {}
  data = '';


/**
 * Abre um SnackBar, com a mensagem desejada
 * @param message Mensagem a ser enviada no SnackBar
 * @param action Por padrão nenhum valor é aplicado
 * @param duration Duração do snackBar fica visível. Por padrão é 3 segundos (3000)
 */
  open(
    message: string | Error | null,
    action: string = '',
    duration: number = 3000,
  ) {
    if (message === null) {
      this.data = '';
    } else if (typeof message === 'string') {
      this.data = message;
    } else if (message instanceof Error) {
      this.data = message.message;
    }
    this.snackBar.open(this.data || '', action, { duration: duration });
  }
}
