import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NumericProperty, Performance, PortRealisation, PortRealisationInput, SeObject} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {PerformanceService} from '../performance.service';
import {NumericPropertyService} from '../numeric-property.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedPerformance: Performance;
  allPerformances: Performance[];
  allNumericProperties: NumericProperty[];
  selectedNumericProperty: NumericProperty;

  constructor(private _performanceService: PerformanceService,
              private _numericPropertyService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
    this._performanceService.allPerformancesUpdated.subscribe((performances) => this.allPerformances = performances);
    this._performanceService.queryAllPerformances(this.selectedPerformance.datasetId);
    this._numericPropertyService.allNumericPropertiesUpdated
      .subscribe((numericProperties) => this.allNumericProperties = numericProperties);
    this._numericPropertyService.queryAllNumericProperties(this.selectedPerformance.datasetId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPerformance']) {
      if (this.selectedNumericProperty) {
        if (this.selectedPerformance.value && this.selectedNumericProperty.uri === this.selectedPerformance.value.uri) {
          this.selectedNumericProperty = this.selectedPerformance.value;
        } else {
          this.selectedNumericProperty = null;
        }
      }
    }
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

  onSelectedObject(object: any): void {
    console.log('PerformanceComponent:onSelectedObject');
    if (this.selectedNumericProperty && this.selectedNumericProperty.uri === object.uri) {
      this.selectedNumericProperty = null;
    } else {
      this.selectedNumericProperty = <NumericProperty>object;
    }
  }

  onCreateObjectRequested(): void {
    const subscription = <Subscription>this._numericPropertyService.numericPropertyCreated.subscribe((numericProperty) => {
      console.log('numericPropertyCreated');
      const performanceInput = this._performanceService.clonePerformanceInput(this.selectedPerformance);
      performanceInput.value = numericProperty.uri;
      this._performanceService.mutatePerformance(performanceInput);
      subscription.unsubscribe();
    });
    console.log('onCreateObjectRequested datasetId=' + this.selectedPerformance.datasetId);
    this._numericPropertyService.createNumericProperty(this.selectedPerformance.datasetId, 'uri', 'label');
  }

  onDeleteObjectRequested(): void {
    const subscription = <Subscription>this._numericPropertyService.numericPropertyDeleted.subscribe((numericProperty) => {
      console.log('numericPropertyDeleted');
      const performanceInput = this._performanceService.clonePerformanceInput(this.selectedPerformance);
      performanceInput.value = null;
      this._performanceService.mutatePerformance(performanceInput);
      subscription.unsubscribe();
    });
    this._numericPropertyService.deleteNumericProperty(this.selectedPerformance.datasetId, this.selectedPerformance.value.uri);
  }
}
