import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  CoinsObject, CoinsObjectInput,
  Hamburger,
  HamburgerInput,
  PortRealisation,
  PortRealisationInput,
  RealisationModule,
  RealisationPort,
  SeObject, SystemInterface,
  SystemSlot
} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {HamburgerService} from '../hamburger.service';
import {SystemSlotService} from '../system-slot.service';
import {RealisationModuleService} from '../realisation-module.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.css']
})
export class HamburgerComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedHamburger: Hamburger;
  allHamburgers: Hamburger[];
  allSystemSlots: SystemSlot[];
  allRealisationModules: RealisationModule[];
  selectedCoinsObject: CoinsObject;
  selectedPortRealisation: PortRealisation;
  portRealisationAssemblyOptions: PortRealisation[];
  portRealisationPartOptions: PortRealisation[];
  systemInterfaceInterfaceOptions: SystemInterface[];
  realisationPortPortOptions: RealisationPort[];

  constructor(private _hamburgerService: HamburgerService,
              private _systemSlotService: SystemSlotService,
              private _realisationModuleService: RealisationModuleService) {
    super();
  }

  ngOnInit() {
    this._hamburgerService.allHamburgersUpdated.subscribe((hamburgers) => this.allHamburgers = hamburgers);
    this._hamburgerService.queryAllHamburgers(this.selectedHamburger.datasetId);
    this._systemSlotService.allSystemSlotsUpdated.subscribe((systemSlots) => this.allSystemSlots = systemSlots);
    this._systemSlotService.queryAllSystemSlots(this.selectedHamburger.datasetId);
    this._realisationModuleService.allRealisationModulesUpdated
      .subscribe((realisationModules) => this.allRealisationModules = realisationModules);
    this._realisationModuleService.queryAllRealisationModules(this.selectedHamburger.datasetId);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedHamburger']) {
      this.selectedPortRealisation = null;
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedHamburger.coins;
      }
    }
  }

  onSessionStarted(propertyLabel: string) {
    super.onSessionStarted(propertyLabel);
    this.selectedPortRealisation = null;
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedHamburger['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedHamburger['assembly'] !== null && this.selectedHamburger['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'functionalUnit':
        if (this.selectedHamburger['functionalUnit'] !== null && this.selectedHamburger['functionalUnit'].uri === propertyValue) {
          return;
        }
        break;
      case 'technicalSolution':
        if (this.selectedHamburger['technicalSolution'] !== null && this.selectedHamburger['technicalSolution'].uri === propertyValue) {
          return;
        }
        break;
      case 'startDate':
        if (this.selectedHamburger['startDate'] === propertyValue) {
          return;
        }
        break;
      case 'endDate':
        if (this.selectedHamburger['endDate'] === propertyValue) {
          return;
        }
        break;

    }
    const hamburgerInput = this._hamburgerService.cloneHamburgerInput(this.selectedHamburger);
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(this.selectedHamburger.coins.name,
        this.selectedHamburger.coins.userID, this.selectedHamburger.coins.description, this.selectedHamburger.coins.creationDate);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    hamburgerInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    this._hamburgerService.mutateHamburger(hamburgerInput, coinsObjectInput);
    this.propertyEdited = null;
  }

  onSelectedObject(object: any, label: string): void {
    console.log('HamburgerComponent:onSelectedObject ' + label);
    switch (label) {
      case 'coins':
        if (this.selectedCoinsObject) {
          this.selectedCoinsObject = null;
        } else {
          this.selectedCoinsObject = <CoinsObject>object;
        }
        console.log('HamburgerComponent:onSelectedObject this.selectedCoinsObject ' + this.selectedCoinsObject);
        break;

      case 'portRealisations':
        if (this.selectedPortRealisation && this.selectedPortRealisation.uri === object.uri) {
          this.selectedPortRealisation = null;
        } else {
          this.selectedPortRealisation = <PortRealisation>object;
          this.portRealisationAssemblyOptions = null;
          this.portRealisationPartOptions = [];
          this.realisationPortPortOptions = [];

          // query the selected Port Realisation
          const subscription = <Subscription>this._hamburgerService.oneHamburgerUpdated.subscribe(oneHamburger => {
            console.log('oneHamburgerUpdated technical solution: ' + oneHamburger.technicalSolution);
            if (oneHamburger.assembly) {
              this.portRealisationAssemblyOptions = oneHamburger.assembly.portRealisations;
            }
            if (oneHamburger.parts && oneHamburger.parts.length > 0) {
              this.portRealisationPartOptions = [];
              for (let index = 0; index < oneHamburger.parts.length; index++) {
                if (oneHamburger.parts[index].portRealisations && oneHamburger.parts[index].portRealisations.length > 0) {
                  for (let portIndex = 0; portIndex < oneHamburger.parts[index].portRealisations.length; portIndex++) {
                    this.portRealisationPartOptions.push(oneHamburger.parts[index].portRealisations[portIndex]);
                  }
                }
              }
            }
            if (oneHamburger.functionalUnit) {
              this.systemInterfaceInterfaceOptions = oneHamburger.functionalUnit.interfaces;
            }
            if (oneHamburger.technicalSolution) {
              console.log('oneHamburgerUpdated technical solution: ' + oneHamburger.technicalSolution.ports);
              this.realisationPortPortOptions = oneHamburger.technicalSolution.ports;
            }
            subscription.unsubscribe();
          });
          this._hamburgerService.queryOneHamburger(this.selectedHamburger.datasetId, this.selectedHamburger.uri);
        }
        break;
    }
  }

  onCreateObjectRequested(): void {
    const subscription = <Subscription>this._hamburgerService.portRealisationCreated.subscribe((portRealisation) => {
      console.log('portRealisationCreated');
      const hamburgerInput = this._hamburgerService.cloneHamburgerInput(this.selectedHamburger);
      if (!this.selectedHamburger.portRealisations) {
        hamburgerInput.portRealisations = [];
      }
      hamburgerInput.portRealisations.push(portRealisation.uri);
      this._hamburgerService.mutateHamburger(hamburgerInput, new CoinsObjectInput(this.selectedHamburger.coins.name,
        this.selectedHamburger.coins.userID, this.selectedHamburger.coins.description, this.selectedHamburger.coins.creationDate));
      subscription.unsubscribe();
    });
    console.log('onCreateObjectRequested datasetId=' + this.selectedHamburger.datasetId);
    this._hamburgerService.createPortRealisation(new PortRealisationInput(this.selectedHamburger.datasetId, 'uri', 'label', null));
  }

  onDeleteObjectRequested(object: SeObject): void {
    const subscription = <Subscription>this._hamburgerService.portRealisationDeleted.subscribe((portRealisation) => {
      const hamburgerInput = this._hamburgerService.cloneHamburgerInput(this.selectedHamburger);
      for (let index = 0; index < hamburgerInput.portRealisations.length; index++) {
        console.log('portRealisationDeleted index=' + index + ' label=' + object.label);
        if (hamburgerInput.portRealisations[index] === object.uri) {
          hamburgerInput.portRealisations.splice(index, 1);
          break;
        }
      }
      this._hamburgerService.mutateHamburger(hamburgerInput, new CoinsObjectInput(this.selectedHamburger.coins.name,
        this.selectedHamburger.coins.userID, this.selectedHamburger.coins.description, this.selectedHamburger.coins.creationDate));
      subscription.unsubscribe();
    });
    console.log('onDeleteObjectRequested label=' + object.label);
    this._hamburgerService.deletePortRealisation(this.selectedHamburger.datasetId, object.uri);
  }

  format(dateTimeStr: string) {
    if (dateTimeStr) {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('nl', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
    }
    return null;
  }
}
