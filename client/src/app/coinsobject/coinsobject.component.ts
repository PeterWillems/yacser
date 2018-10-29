import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  CoinsObject,
  CoinsObjectInput,
  CoinsProperty,
  RealisationPortInput,
  SeObject,
  SystemInterface,
  SystemInterfaceInput
} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-coinsobject',
  templateUrl: './coinsobject.component.html',
  styleUrls: ['./coinsobject.component.css']
})
export class CoinsobjectComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedCoinsObject: CoinsObject;
  @Output() updatedCoinsObject = new EventEmitter<CoinsObjectInput>();
  selectedProperty: CoinsProperty;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    if (propertyLabel === 'hasProperties') {
      return;
    }
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
    if (!dateTimeStr) {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('nl', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
    }
    return null;
  }

  private _cloneCoinsObjectInput(coinsObject: CoinsObject): CoinsObjectInput {
    const coinsObjectInput = new CoinsObjectInput(coinsObject.name, coinsObject.userID, coinsObject.description, coinsObject.creationDate);
    if (coinsObject.hasProperties) {
      coinsObjectInput.hasProperties = [];
      for (let index = 0; index < coinsObject.hasProperties.length; index++) {
        coinsObjectInput.hasProperties.push(coinsObject.hasProperties[index]);
      }
    }
    return coinsObjectInput;
  }

  public onSelectedProperty(selectedProperty: CoinsProperty): void {
    if (this.selectedProperty) {
      this.selectedProperty = selectedProperty === this.selectedProperty ? null : selectedProperty;
    } else {
      this.selectedProperty = selectedProperty;
    }
  }

  public onCreateObjectRequested(): void {
    console.log('onCreateObjectRequested');

    const coinsObjectInput = this._cloneCoinsObjectInput(this.selectedCoinsObject);
    if (!coinsObjectInput.hasProperties) {
      coinsObjectInput.hasProperties = [];
    }
    coinsObjectInput.hasProperties.push(
      new CoinsProperty('new property', 'http://www.coinsweb.nl/cbim-2.0.rdf#StringProperty', 'property value'));
    this.updatedCoinsObject.emit(coinsObjectInput);
//    this.propertyEdited = null;
  }

  public onDeleteObjectRequested(coinsProperty: CoinsProperty): void {
    console.log('onDeleteObjectRequested');

    const coinsObjectInput = this._cloneCoinsObjectInput(this.selectedCoinsObject);
    for (let index = 0; index < coinsObjectInput.hasProperties.length; index++) {
      console.log('index=' + index + ' ' + coinsObjectInput.hasProperties[index].name + ' ' + coinsProperty.name);
      if (coinsObjectInput.hasProperties[index].name === coinsProperty.name) {
        console.log(coinsObjectInput.hasProperties.length);
        coinsObjectInput.hasProperties.splice(index, 1);
        console.log(coinsObjectInput.hasProperties.length);
        break;
      }
    }

    this.updatedCoinsObject.emit(coinsObjectInput);
//    this.propertyEdited = null;
  }

  public onUpdateObjectRequested(coinsProperty: CoinsProperty): void {
    console.log('onUpdateObjectRequested');

    const coinsObjectInput = this._cloneCoinsObjectInput(this.selectedCoinsObject);
    for (let index = 0; index < coinsObjectInput.hasProperties.length; index++) {
      console.log('index=' + index + ' ' + coinsObjectInput.hasProperties[index].name + ' ' + coinsProperty.name);
      if (coinsObjectInput.hasProperties[index].name === this.selectedProperty.name) {
        console.log(coinsObjectInput.hasProperties.length);
        coinsObjectInput.hasProperties[index] = coinsProperty;
        console.log(coinsObjectInput.hasProperties.length);
        break;
      }
    }

    this.updatedCoinsObject.emit(coinsObjectInput);
//    this.propertyEdited = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedCoinsObjectChange = changes['selectedCoinsObject'];
    if (selectedCoinsObjectChange) {
      const value = selectedCoinsObjectChange.currentValue;
      console.log('selectedCoinsObjectChange' + value ? value.toString() : null);
      this.selectedProperty = null;
    }
  }

}
