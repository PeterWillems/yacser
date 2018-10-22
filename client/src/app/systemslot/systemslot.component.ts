import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CoinsObject, CoinsObjectInput, NumericProperty, Requirement, SystemInterface, SystemSlot} from '../types';
import {SystemSlotService} from '../system-slot.service';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SystemInterfaceService} from '../system-interface.service';
import {SeObjectComponent} from '../se-object-component';
import {Router} from '@angular/router';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-systemslot',
  templateUrl: './systemslot.component.html',
  styleUrls: ['./systemslot.component.css'],
})
export class SystemslotComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedSystemSlot: SystemSlot;
//  @Output() selectedSystemSlotChanged = new EventEmitter<string>();
  allSystemSlots: SystemSlot[];
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
  selectedCoinsObject: CoinsObject;

  constructor(private _systemSlotService: SystemSlotService,
              private _functionService: FunctionService,
              private _requirementService: RequirementService,
              private _systemInterfaceService: SystemInterfaceService,
              private router: Router) {
    super();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSystemSlot']) {
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedSystemSlot.coins;
      }
    }
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
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
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(this.selectedSystemSlot.coins.name,
        this.selectedSystemSlot.coins.userID, this.selectedSystemSlot.coins.description, this.selectedSystemSlot.coins.creationDate);
    systemSlotInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (systemSlotInput[propertyLabel] ? systemSlotInput[propertyLabel] : '<null>'));
    this._systemSlotService.mutateSystemSlot(systemSlotInput, coinsObjectInput);
    this.propertyEdited = null;
  }

  onSelectedObject(object: any): void {
    console.log('SystemSlotComponent:onSelectedObject');
    if (this.selectedCoinsObject) {
      this.selectedCoinsObject = null;
    } else {
      this.selectedCoinsObject = <CoinsObject>object;
    }
  }
}
