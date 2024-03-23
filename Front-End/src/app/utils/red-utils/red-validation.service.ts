import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { redService } from 'src/app/services/red.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class RedValidationService {
  constructor(private redservice: redService, private snackBar: MatSnackBar) {}

  async validarRED(red: any) {
    const inicioAfastamentoValido = this.verificarDataInicioAfastamento(
      red.inicioAfastamento
    );
    const redsExistente = await this.redservice.getRed();
    const redExistenteNoMesmoPeriodo = redsExistente.data.reds.find(
      (entidade: any) => {
        const inicioAfastamentoRed = this.dateToString(entidade.inicioAfastamento);
        const previsaoTerminoRed = this.dateToString(entidade.dataPrevisaoTermino);
        const inicioAfastamentoThis = this.dateToString(red.inicioAfastamento);
        const previsaoTerminoThis = this.dateToString(this.previsaoTerminoRed(red.inicioAfastamento, red.tempoAfastamento));

        return (
          inicioAfastamentoRed === inicioAfastamentoThis &&
          previsaoTerminoRed === previsaoTerminoThis
        );
      }
    );
    if (red.tempoAfastamento < 15 || red.tempoAfastamento > 360) {
      this.openSnackBar('O período de afastamento deve ser entre 15 a 360 dias.',null);
      return;
    }
    if (red.semestreAluno <= 0 || red.semestreAluno > 20) {
      this.openSnackBar('O semestre informado deve estar entre 1 e 24.', null);
      return;
    }
    if (redExistenteNoMesmoPeriodo) {
      this.openSnackBar('Já existe um RED para este prontuário no mesmo período! ',null);
      return;
    }
    if (!inicioAfastamentoValido) {
      this.openSnackBar('O início do afastamento deve ser no máximo 7 dias antes da data de hoje! ',null);
      return;
    }
  }

  private verificarDataInicioAfastamento(dataInicioAfastamento: Date): boolean {
    const hoje = new Date();
    const dataInicio = new Date(dataInicioAfastamento);
    const diff = Math.abs(hoje.getTime() - dataInicio.getTime());
    const diffEmDias = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diffEmDias <= 7;
  }

  private dateToString(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  previsaoTerminoRed(inicioAfastamento: string, tempoAfastamento: number): Date {
    const dataTerminoRed = new Date(inicioAfastamento);
    dataTerminoRed.setDate(dataTerminoRed.getDate() + tempoAfastamento);

    // Adiciona mais 30 dias ao resultado anterior
    const dataFinal = new Date(dataTerminoRed);
    dataFinal.setDate(dataFinal.getDate() + 30);
    return dataFinal;
  }

  private openSnackBar(message: string, error: string | Error | null) {
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
      duration: 3000,
    });
  }
}
