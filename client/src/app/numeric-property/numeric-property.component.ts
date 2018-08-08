import {Component, Input, OnInit} from '@angular/core';
import {NumericProperty} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {NumericPropertyService} from '../numeric-property.service';
import {DatasetService} from '../dataset.service';

@Component({
  selector: 'app-numeric-property',
  templateUrl: './numeric-property.component.html',
  styleUrls: ['./numeric-property.component.css']
})
export class NumericPropertyComponent extends SeObjectComponent implements OnInit {
  @Input() selectedNumericProperty: NumericProperty;

  constructor(private _datasetService: DatasetService,
              private _numericPropertyService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedNumericProperty['label'] === propertyValue) {
          return;
        }
        break;
      case 'datatypeValue':
        if (this.selectedNumericProperty['datatypeValue'] !== null
          && this.selectedNumericProperty['datatypeValue'].toString() === propertyValue) {
          return;
        }
        break;
    }
    const numericPropertyInput = this._numericPropertyService.cloneNumericPropertyInput(this.selectedNumericProperty);
    numericPropertyInput.datasetId = this._datasetService.getSelectedDataset().datasetId;
    numericPropertyInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (numericPropertyInput[propertyLabel] ? numericPropertyInput[propertyLabel] : '<null>'));
    this._numericPropertyService.mutateNumericProperty(numericPropertyInput);
    this.propertyEdited = null;
  }

}
