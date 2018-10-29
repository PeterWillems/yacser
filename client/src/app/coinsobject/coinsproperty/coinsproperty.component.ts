import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CoinsObject, CoinsObjectInput, CoinsProperty} from '../../types';
import {SeObjectComponent} from '../../se-object-component';

@Component({
  selector: 'app-coinsproperty',
  templateUrl: './coinsproperty.component.html',
  styleUrls: ['./coinsproperty.component.css']
})
export class CoinspropertyComponent extends SeObjectComponent implements OnInit {
  public static coins2NameSpace = 'http://www.coinsweb.nl/cbim-2.0.rdf#';
  public static types = [
    CoinspropertyComponent.coins2NameSpace + 'BooleanProperty',
    CoinspropertyComponent.coins2NameSpace + 'DateTimeProperty',
    CoinspropertyComponent.coins2NameSpace + 'DocumentProperty',
    CoinspropertyComponent.coins2NameSpace + 'FloatProperty',
    CoinspropertyComponent.coins2NameSpace + 'IntegerProperty',
    CoinspropertyComponent.coins2NameSpace + 'LocatorProperty',
    CoinspropertyComponent.coins2NameSpace + 'ShapeRepresentationProperty',
    CoinspropertyComponent.coins2NameSpace + 'StringProperty',
    CoinspropertyComponent.coins2NameSpace + 'UriProperty'
  ];

  public get types() {
    return CoinspropertyComponent.types;
  }

  @Input() selectedProperty: CoinsProperty;
  @Output() updatedCoinsProperty = new EventEmitter<CoinsProperty>();

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);

    if (this.selectedProperty[propertyLabel] === propertyValue) {
      console.log('NO CHANGE DETECTED');
      return;
    }

    const coinsPropertyInput = new CoinsProperty(this.selectedProperty.name, this.selectedProperty.type, this.selectedProperty.value);
    coinsPropertyInput[propertyLabel] = propertyValue;
    if (propertyLabel === 'type') {
      switch (propertyValue) {
        case this.types[0]: // Boolean
          coinsPropertyInput.value = 'false';
          break;
        case this.types[1]: // DateTime
          coinsPropertyInput.value = '1970-01-01T00:00:00.000Z';
          break;
        case this.types[2]: // Document
          coinsPropertyInput.value = null;
          break;
        case this.types[3]: // Float
          coinsPropertyInput.value = '0.0';
          break;
        case this.types[4]: // Integer
          coinsPropertyInput.value = '0';
          break;
        case this.types[5]: // Locator
          coinsPropertyInput.value = null;
          break;
        case this.types[6]: // ShapeRepresentation
          coinsPropertyInput.value = null;
          break;
        case this.types[7]: // String
          coinsPropertyInput.value = ' ';
          break;
        case this.types[8]: // Uri
          coinsPropertyInput.value = null;
          break;
      }
    }
    console.log('propertyLabel=' + propertyLabel + ' ' + (coinsPropertyInput[propertyLabel] ? coinsPropertyInput[propertyLabel] : '<null>'));
    this.updatedCoinsProperty.emit(coinsPropertyInput);
    this.propertyEdited = null;
  }

}
