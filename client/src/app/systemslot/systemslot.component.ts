import {Component, Input, OnInit} from '@angular/core';
import {Requirement, SeObject, SystemInterface, SystemSlot, SystemSlotInput} from '../types';
import {SystemSlotService} from '../system-slot.service';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SystemInterfaceService} from '../system-interface.service';

@Component({
  selector: 'app-systemslot',
  templateUrl: './systemslot.component.html',
  styleUrls: ['./systemslot.component.css'],
})
export class SystemslotComponent implements OnInit {
  @Input() selectedSystemSlot: SystemSlot;
  allSystemSlots: SystemSlot[];
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
  propertyEdited: string;

  constructor(private _systemSlotService: SystemSlotService,
              private _functionService: FunctionService,
              private _requirementService: RequirementService,
              private _systemInterfaceService: SystemInterfaceService) {
  }

  ngOnInit() {
    this._systemSlotService.allSystemSlotsUpdated.subscribe((systemSlots) => this.allSystemSlots = systemSlots);
    this._systemSlotService.queryAllSystemSlots(this.selectedSystemSlot.datasetId);
    this._functionService.allFunctionsUpdated.subscribe((functions) => this.allFunctions = functions);
    this._functionService.queryAllFunctions(this.selectedSystemSlot.datasetId);
    this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedSystemSlot.datasetId);
    this._systemInterfaceService.allSystemInterfacesUpdated.subscribe((systemInterfaces) => this.allSystemInterfaces = systemInterfaces);
    this._systemInterfaceService.queryAllSystemInterfaces(this.selectedSystemSlot.datasetId);
  }

  show(object: SeObject): string {
    return this._systemSlotService.show(object);
  }

  showList(list: Array<SeObject>): string {
    return this._systemSlotService.showList(list);
  }

  onSessionStarted(propertyLabel: string) {
    this.propertyEdited = (this.propertyEdited === propertyLabel) ? null : propertyLabel;
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedSystemSlot['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedSystemSlot['assembly'] !== null && this.selectedSystemSlot['assembly'].uri === propertyValue) {
          return;
        }
        break;
    }
    const systemSlotInput = this._systemSlotService.cloneSystemSlotInput(this.selectedSystemSlot);
    systemSlotInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (systemSlotInput[propertyLabel] ? systemSlotInput[propertyLabel] : '<null>'));
    this._systemSlotService.mutateSystemSlot(systemSlotInput);
    this.propertyEdited = null;
  }
}
