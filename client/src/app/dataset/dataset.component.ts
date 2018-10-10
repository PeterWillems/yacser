import {Component, Input, OnInit} from '@angular/core';
import {CoinsObjectInput, Dataset} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {DatasetService} from '../dataset.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent extends SeObjectComponent implements OnInit {
  @Input() selectedDataset: Dataset;

  constructor(private _datasetService: DatasetService) {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'versionInfo':
        if (this.selectedDataset['versionInfo'] === propertyValue) {
          return;
        }
        break;
    }
    const datasetInput = this._datasetService.cloneDatasetInput(this.selectedDataset);
    datasetInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (datasetInput[propertyLabel] ? datasetInput[propertyLabel] : '<null>'));
    this._datasetService.mutateDataset(datasetInput);
    this.propertyEdited = null;
  }
}
