import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Hamburger, HamburgerInput, PortRealisation, PortRealisationInput, RealisationModule, SeObject, SystemSlot} from '../types';
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
  selectedPortRealisation: PortRealisation;
  portRealisationAssemblyOptions: PortRealisation[];
  portRealisationPartOptions: PortRealisation[];

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
    }
  }

  onSessionStarted(propertyLabel: string) {
    super.onSessionStarted(propertyLabel);
    this.selectedPortRealisation = null;
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
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
    }
    const hamburgerInput = this._hamburgerService.cloneHamburgerInput(this.selectedHamburger);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    hamburgerInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    this._hamburgerService.mutateHamburger(hamburgerInput);
    this.propertyEdited = null;
  }

  onSelectedObject(seObject: SeObject): void {
    console.log('HamburgerComponent:onSelectedObject');
    if (this.selectedPortRealisation && this.selectedPortRealisation.uri === seObject.uri) {
      this.selectedPortRealisation = null;
    } else {
      this.selectedPortRealisation = <PortRealisation>seObject;
      this.portRealisationAssemblyOptions = null;
      this.portRealisationPartOptions = null;

      // query the selected Port Realisation
      const subscription = <Subscription>this._hamburgerService.oneHamburgerUpdated.subscribe(oneHamburger => {
        console.log('oneHamburgerUpdated');
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
        subscription.unsubscribe();
      });
      this._hamburgerService.queryOneHamburger(this.selectedHamburger.datasetId, this.selectedHamburger.uri);
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
      this._hamburgerService.mutateHamburger(hamburgerInput);
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
      this._hamburgerService.mutateHamburger(hamburgerInput);
      subscription.unsubscribe();
    });
    console.log('onDeleteObjectRequested label=' + object.label);
    this._hamburgerService.deletePortRealisation(this.selectedHamburger.datasetId, object.uri);
  }
}
