import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent {

  constructor(private location: Location) {}

  voltar() {
    this.location.back();
  }
}