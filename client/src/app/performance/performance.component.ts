import {Component, Input, OnInit} from '@angular/core';
import {NumericProperty, Performance} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {PerformanceService} from '../performance.service';
import {NumericPropertyService} from '../numeric-property.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent extends SeObjectComponent implements OnInit {
  @Input() selectedPerformance: Performance;
  allPerformances: Performance[];
  allNumericProperties: NumericProperty[];

  constructor(private _performanceService: PerformanceService,
              private _numericPropertieService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
    this._performanceService.allPerformancesUpdated.subscribe((performances) => this.allPerformances = performances);
    this._performanceService.queryAllPerformances(this.selectedPerformance.datasetId);
    this._numericPropertieService.allNumericPropertiesUpdated
      .subscribe((numericProperties) => this.allNumericProperties = numericProperties);
    this._numericPropertieService.queryAllNumericProperties(this.selectedPerformance.datasetId);
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedPerformance['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedPerformance['assembly'] !== null && this.selectedPerformance['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'value':
        if (this.selectedPerformance['value'] !== null && this.selectedPerformance['value'].uri === propertyValue) {
          return;
        }
        break;
    }
    const performanceInput = this._performanceService.clonePerformanceInput(this.selectedPerformance);
    performanceInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (performanceInput[propertyLabel] ? performanceInput[propertyLabel] : '<null>'));
    this._performanceService.mutatePerformance(performanceInput);
    this.propertyEdited = null;
  }

}
