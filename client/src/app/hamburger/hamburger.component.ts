import {Component, Input, OnInit} from '@angular/core';
import {Hamburger, RealisationModule, SystemSlot} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {HamburgerService} from '../hamburger.service';
import {SystemSlotService} from '../system-slot.service';
import {RealisationModuleService} from '../realisation-module.service';

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.css']
})
export class HamburgerComponent extends SeObjectComponent implements OnInit {
  @Input() selectedHamburger: Hamburger;
  allHamburgers: Hamburger[];
  allSystemSlots: SystemSlot[];
  allRealisationModules: RealisationModule[];

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
    hamburgerInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (hamburgerInput[propertyLabel] ? hamburgerInput[propertyLabel] : '<null>'));
    this._hamburgerService.mutateHamburger(hamburgerInput);
    this.propertyEdited = null;
  }

}
