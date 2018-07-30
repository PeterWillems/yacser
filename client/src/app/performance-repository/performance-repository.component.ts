import {Component, OnInit} from '@angular/core';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Dataset, Performance, PerformanceInput, Requirement, RequirementInput} from '../types';
import {DatasetService} from '../dataset.service';
import {PerformanceService} from '../performance.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-performance-repository',
  templateUrl: './performance-repository.component.html',
  styleUrls: ['./performance-repository.component.css']
})
export class PerformanceRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  selectedPerformance: Performance;
  allPerformances: Performance[];

  constructor(private _datasetService: DatasetService,
              private _performanceService: PerformanceService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._performanceService.allPerformancesUpdated.subscribe((performances) => {
        this.allPerformances = performances;
        this.selectedPerformance = <Performance>this.resetSelected(this._performanceService.selectedPerformance, performances);
      });
      this._performanceService.queryAllPerformances(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this.selectedPerformance = this.allPerformances[index];
    this._performanceService.selectedPerformance = this.selectedPerformance;
  }

  onCreate(): void {
    const subscription = <Subscription>this._performanceService.performanceCreated.subscribe((value) => {
      this.selectedPerformance = value;
      this._performanceService.selectedPerformance = this.selectedPerformance;
      subscription.unsubscribe();
    });
    this._performanceService.createPerformance(new PerformanceInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._performanceService.performanceDeleted.subscribe((value) => {
      this.selectedPerformance = null;
      this._performanceService.selectedPerformance = this.selectedPerformance;
      subscription.unsubscribe();
    });
    this._performanceService.deletePerformance(this.allPerformances[index].datasetId, this.allPerformances[index].uri);
  }
}
