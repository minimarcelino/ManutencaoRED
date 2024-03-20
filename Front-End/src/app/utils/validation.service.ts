import { Injectable } from '@angular/core';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private snackBar: MatSnackBar) {}

  validarCampoDisciplina(campo: string, formGroup: FormGroup) {
    const campoDisciplinaControl = formGroup.get(campo);

    // Verifica se o FormGroup está sujo
    if (
      !campoDisciplinaControl?.value ||
      campoDisciplinaControl?.value.trim() === '' ||
      campoDisciplinaControl?.value.trim().length === 0
    ) {
      this.openSnackBar(`${campo} da disciplina é obrigatório.`, null);
      return;
    }
  }

  validarSelectDisciplina(campo: string, formGroup: FormGroup) {
    const campoDisciplinaControl = formGroup.get(campo);
    if (!campoDisciplinaControl?.value) {
      this.openSnackBar(`${campo} da disciplina é obrigatório.`, null);
      return;
    }
  }

  openSnackBar(message: string, error: string | Error | null) {
    let data;
    if (error === null) {
      data = { message };
    } else if (typeof error === 'string') {
      data = { message: error };
    } else if (error instanceof Error) {
      data = { message: error.message };
    }

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: data,
      duration: 750,
    });
  }
}
