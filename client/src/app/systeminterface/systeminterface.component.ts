import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CoinsObject, CoinsObjectInput, Requirement, SystemInterface, SystemInterfaceInput, SystemSlot} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {SystemInterfaceService} from '../system-interface.service';
import {SystemSlotService} from '../system-slot.service';
import {RequirementService} from '../requirement.service';

@Component({
  selector: 'app-systeminterface',
  templateUrl: './systeminterface.component.html',
  styleUrls: ['./systeminterface.component.css']
})
export class SysteminterfaceComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedSystemInterface: SystemInterface;
  allSystemInterfaces: SystemInterface[];
  allSystemSlots: SystemSlot[];
  allRequirements: Requirement[];
  selectedCoinsObject: CoinsObject;

  constructor(private _systemInterfaceService: SystemInterfaceService,
              private _systemSlotService: SystemSlotService,
              private _requirementService: RequirementService) {
    super();
  }

  ngOnInit() {
    this._systemInterfaceService.allSystemInterfacesUpdated
      .subscribe((systemInterfaces) => this.allSystemInterfaces = systemInterfaces);
    this._systemInterfaceService.queryAllSystemInterfaces(this.selectedSystemInterface.datasetId);
    this._systemSlotService.allSystemSlotsUpdated
      .subscribe((systemSlots) => this.allSystemSlots = systemSlots);
    this._systemSlotService.queryAllSystemSlots(this.selectedSystemInterface.datasetId);
    this._requirementService.allRequirementsUpdated
      .subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedSystemInterface.datasetId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSystemInterface']) {
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedSystemInterface.coins;
      }
    }
  }

  onSelectedObject(object: any, label: string): void {
    switch (label) {
      case 'coins':
        if (this.selectedCoinsObject) {
          this.selectedCoinsObject = null;
        } else {
          this.selectedCoinsObject = <CoinsObject>object;
        }
        break;
    }
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedSystemInterface['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedSystemInterface['assembly'] !== null && this.selectedSystemInterface['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'systemSlot0':
        if (this.selectedSystemInterface['systemSlot0'] !== null && this.selectedSystemInterface['systemSlot0'].uri === propertyValue) {
          return;
        }
        break;
      case 'systemSlot1':
        if (this.selectedSystemInterface['systemSlot1'] !== null && this.selectedSystemInterface['systemSlot1'].uri === propertyValue) {
          return;
        }
        break;
    }
    const systemInterfaceInput = <SystemInterfaceInput>this._systemInterfaceService.cloneSystemInterfaceInput(this.selectedSystemInterface);
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(
        this.selectedSystemInterface.coins.name,
        this.selectedSystemInterface.coins.userID,
        this.selectedSystemInterface.coins.description,
        this.selectedSystemInterface.coins.creationDate);
    systemInterfaceInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' '
      + (systemInterfaceInput[propertyLabel] ? systemInterfaceInput[propertyLabel] : '<null>'));
    this._systemInterfaceService.mutateSystemInterface(systemInterfaceInput, coinsObjectInput);
    this.propertyEdited = null;
  }

}
