import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dataset, Requirement, SeObject, SystemInterface, SystemSlot} from '../types';
import {SystemSlotService} from '../system-slot.service';
import {DatasetService} from '../dataset.service';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SystemInterfaceService} from '../system-interface.service';

@Component({
  selector: 'app-systemslot-repository',
  templateUrl: './systemslot-repository.component.html',
  styleUrls: ['./systemslot-repository.component.css']
})
export class SystemslotRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  datasetId: number;
  selectedSystemSlot: SystemSlot;
  _selectedSystemSlotIndex: number;
  allSystemSlots: SystemSlot[];
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];

  constructor(
    private _datasetService: DatasetService,
    private _systemSlotService: SystemSlotService,
    private _functionService: FunctionService,
    private _requirementService: RequirementService,
    private _systemInterfaceService: SystemInterfaceService) {
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._systemSlotService.allSystemSlotsUpdated.subscribe((systemSlots) => this.allSystemSlots = systemSlots);
      this._systemSlotService.queryAllSystemSlots(this.selectedDataset.datasetId);
      this._functionService.allFunctionsUpdated.subscribe((functions) => this.allFunctions = functions);
      this._functionService.queryAllFunctions(this.selectedDataset.datasetId);
      this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
      this._requirementService.queryAllRequirements(this.selectedDataset.datasetId);
      this._systemInterfaceService.allSystemInterfacesUpdated.subscribe((systemInterfaces) => this.allSystemInterfaces = systemInterfaces);
      this._systemInterfaceService.queryAllSystemInterfaces(this.selectedDataset.datasetId);
    }
  }

  localName(systemSlot: SystemSlot): string {
    const hashMarkIndex = systemSlot.uri.indexOf('#');
    return systemSlot.uri.substring(hashMarkIndex);
  }

  show(object: SeObject): string {
    return this._systemSlotService.show(object);
  }

  onSelect(index: number): void {
    this._selectedSystemSlotIndex = index;
    this.selectedSystemSlot = this.allSystemSlots[index];
  }
}
