import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CoinsObject, CoinsObjectInput, SeObject, SystemInterface, SystemInterfaceInput} from '../types';
import {SeObjectComponent} from '../se-object-component';

@Component({
  selector: 'app-coinsobject',
  templateUrl: './coinsobject.component.html',
  styleUrls: ['./coinsobject.component.css']
})
export class CoinsobjectComponent extends SeObjectComponent implements OnInit {
  @Input() selectedCoinsObject: CoinsObject;
  @Output() updatedCoinsObject = new EventEmitter<CoinsObjectInput>();

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    if (this.selectedCoinsObject[propertyLabel] === propertyValue) {
      console.log('NO CHANGE DETECTED');
      return;
    }

    const coinsObjectInput = this._cloneCoinsObjectInput(this.selectedCoinsObject);
    coinsObjectInput[propertyLabel] = propertyValue;
    console.log('propertyLabel=' + propertyLabel + ' ' + (coinsObjectInput[propertyLabel] ? coinsObjectInput[propertyLabel] : '<null>'));
    this.updatedCoinsObject.emit(coinsObjectInput);
    this.propertyEdited = null;
  }

  format(dateTimeStr: string) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('nl', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
  }

  private _cloneCoinsObjectInput(coinsObject: CoinsObject): CoinsObjectInput {
    const coinsObjectInput = new CoinsObjectInput(coinsObject.name, coinsObject.userID, coinsObject.description, coinsObject.creationDate);
    return coinsObjectInput;
  }

}
