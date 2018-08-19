import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CoinsObject, CoinsObjectInput, RealisationModule, RealisationPort, RealisationPortInput, SeObject} from '../types';
import {RealisationModuleService} from '../realisation-module.service';
import {SeObjectComponent} from '../se-object-component';
import {PerformanceService} from '../performance.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-realisation-module',
  templateUrl: './realisation-module.component.html',
  styleUrls: ['./realisation-module.component.css']
})
export class RealisationModuleComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedRealisationModule: RealisationModule;
  allRealisationModules: RealisationModule[];
  allPerformances: Performance[];
  selectedCoinsObject: CoinsObject;
  selectedPort: RealisationPort;
  portAssemblyOptions: RealisationPort[];
  portPartOptions: RealisationPort[];

  constructor(private _realisationModuleService: RealisationModuleService,
              private _performanceService: PerformanceService) {
    super();
  }

  ngOnInit() {
    this._realisationModuleService.allRealisationModulesUpdated
      .subscribe((allRealisationModules) => this.allRealisationModules = allRealisationModules);
    this._realisationModuleService.queryAllRealisationModules(this.selectedRealisationModule.datasetId);
    this._performanceService.allPerformancesUpdated.subscribe((allPerformances) => this.allPerformances = allPerformances);
    this._performanceService.queryAllPerformances(this.selectedRealisationModule.datasetId);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedRealisationModule']) {
      this.selectedPort = null;
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedRealisationModule.coins;
      }
    }
  }

  onSessionStarted(propertyLabel: string) {
    super.onSessionStarted(propertyLabel);
    this.selectedPort = null;
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedRealisationModule['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedRealisationModule['assembly'] !== null && this.selectedRealisationModule['assembly'].uri === propertyValue) {
          return;
        }
        break;
    }
    const hamburgerInput = this._realisationModuleService.cloneRealisationModuleInput(this.selectedRealisationModule);
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(this.selectedRealisationModule.coins.name,
        this.selectedRealisationModule.coins.userID, this.selectedRealisationModule.coins.description,
        this.selectedRealisationModule.coins.creationDate);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    hamburgerInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    this._realisationModuleService.mutateRealisationModule(hamburgerInput, coinsObjectInput);
    this.propertyEdited = null;
  }

  onSelectedObject(object: any, label: string): void {
    console.log('RealisationModuleComponent:onSelectedObject ' + label);
    switch (label) {
      case 'coins':
        if (this.selectedCoinsObject) {
          this.selectedCoinsObject = null;
        } else {
          this.selectedCoinsObject = <CoinsObject>object;
        }
        console.log('RequirementComponent:onSelectedObject this.selectedCoinsObject ' + this.selectedCoinsObject);
        break;
      case 'ports':
        if (this.selectedPort && this.selectedPort.uri === object.uri) {
          this.selectedPort = null;
        } else {
          this.selectedPort = <RealisationPort>object;
          this.portAssemblyOptions = null;
          this.portPartOptions = [];

          // query the selected port
          const subscription = <Subscription>this._realisationModuleService.oneRealisationModuleUpdated.subscribe(oneRealisationModule => {
            console.log('oneRealisationModuleUpdated');
            if (oneRealisationModule.assembly) {
              this.portAssemblyOptions = oneRealisationModule.assembly.ports;
            }
            if (oneRealisationModule.parts && oneRealisationModule.parts.length > 0) {
              this.portPartOptions = [];
              for (let index = 0; index < oneRealisationModule.parts.length; index++) {
                if (oneRealisationModule.parts[index].ports && oneRealisationModule.parts[index].ports.length > 0) {
                  for (let portIndex = 0; portIndex < oneRealisationModule.parts[index].ports.length; portIndex++) {
                    this.portPartOptions.push(oneRealisationModule.parts[index].ports[portIndex]);
                  }
                }
              }
            }
            subscription.unsubscribe();
          });
          this._realisationModuleService
            .queryOneRealisationModule(this.selectedRealisationModule.datasetId, this.selectedRealisationModule.uri);
        }
        break;
    }
  }

  onCreateObjectRequested(): void {
    const subscription = <Subscription>this._realisationModuleService.realisationPortCreated.subscribe((realisationPort) => {
      console.log('realisationPortCreated');
      const realisationModuleInput = this._realisationModuleService.cloneRealisationModuleInput(this.selectedRealisationModule);
      if (!this.selectedRealisationModule.ports) {
        realisationModuleInput.ports = [];
      }
      realisationModuleInput.ports.push(realisationPort.uri);
      this._realisationModuleService.mutateRealisationModule(realisationModuleInput,
        new CoinsObjectInput(this.selectedRealisationModule.coins.name, this.selectedRealisationModule.coins.userID,
          this.selectedRealisationModule.coins.description, this.selectedRealisationModule.coins.creationDate));
      subscription.unsubscribe();
    });
    console.log('onCreateObjectRequested datasetId=' + this.selectedRealisationModule.datasetId);
    this._realisationModuleService
      .createRealisationPort(new RealisationPortInput(this.selectedRealisationModule.datasetId, 'uri', 'label', null));
  }

  onDeleteObjectRequested(object: SeObject): void {
    const subscription = <Subscription>this._realisationModuleService.realisationPortDeleted.subscribe((realisationPort) => {
      const realisationModuleInput = this._realisationModuleService.cloneRealisationModuleInput(this.selectedRealisationModule);
      for (let index = 0; index < realisationModuleInput.ports.length; index++) {
        console.log('realisationPortDeleted index=' + index + ' label=' + object.label);
        if (realisationModuleInput.ports[index] === object.uri) {
          realisationModuleInput.ports.splice(index, 1);
          break;
        }
      }
      this._realisationModuleService.mutateRealisationModule(realisationModuleInput,
        new CoinsObjectInput(this.selectedRealisationModule.coins.name, this.selectedRealisationModule.coins.userID,
          this.selectedRealisationModule.coins.description, this.selectedRealisationModule.coins.creationDate));
      subscription.unsubscribe();
    });
    console.log('onDeleteObjectRequested label=' + object.label);
    this._realisationModuleService.deleteRealisationPort(this.selectedRealisationModule.datasetId, object.uri);
  }
}
