import {Component, OnInit} from '@angular/core';
import {Dataset} from '../types';
import {DatasetService} from '../dataset.service';

@Component({
  selector: 'app-dataset-repository',
  templateUrl: './dataset-repository.component.html',
  styleUrls: ['./dataset-repository.component.css']
})
export class DatasetRepositoryComponent implements OnInit {
  datasets: Dataset[];
  selectedDataset: Dataset;

  constructor(private _datasetService: DatasetService) {
  }

  ngOnInit() {
    this._datasetService.datasetsUpdated.subscribe((datasets) => {
      this.datasets = datasets;
      this.selectedDataset = this._datasetService.getSelectedDataset();
    });
    this._datasetService.queryAllDatasets();
  }

  selectDataset(dataset: Dataset): void {
    console.log('DatasetComponent:selectDataset: ' + dataset.datasetId + ' uri: ' + dataset.uri);
    this.selectedDataset = dataset;
    this._datasetService.setSelectedDataset(this.selectedDataset);
  }

  isSelected(dataset: Dataset): string {
    if (this.selectedDataset) {
      if (this.selectedDataset.datasetId === dataset.datasetId) {
        return 'selected-dataset';
      }
    }
    return '';
  }

  saveDataset(dataset: Dataset): void {
    this._datasetService.saveDataset(dataset.datasetId);
  }
}
