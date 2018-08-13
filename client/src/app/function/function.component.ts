import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CoinsObject, CoinsObjectInput, Function, NumericProperty, Requirement, SystemInterface} from '../types';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SeObjectComponent} from '../se-object-component';
import {SystemInterfaceService} from '../system-interface.service';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedFunction: Function;
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
  selectedCoinsObject: CoinsObject;

  constructor(private _functionService: FunctionService,
              private _requirementService: RequirementService,
              private _systemInterfaceService: SystemInterfaceService) {
    super();
  }

  ngOnInit() {
    this._functionService.allFunctionsUpdated.subscribe((functions) => this.allFunctions = functions);
    this._functionService.queryAllFunctions(this.selectedFunction.datasetId);
    this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedFunction.datasetId);
    this._systemInterfaceService.allSystemInterfacesUpdated.subscribe((systemInterface) => this.allSystemInterfaces = systemInterface);
    this._systemInterfaceService.queryAllSystemInterfaces(this.selectedFunction.datasetId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFunction']) {
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedFunction.coins;
      }
    }
  }

  onSelectedObject(object: any, label: string): void {
    console.log('RequirementComponent:onSelectedObject ' + label);
    switch (label) {
      case 'coins':
        if (this.selectedCoinsObject) {
          this.selectedCoinsObject = null;
        } else {
          this.selectedCoinsObject = <CoinsObject>object;
        }
        console.log('RequirementComponent:onSelectedObject this.selectedCoinsObject ' + this.selectedCoinsObject);
        break;
    }
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedFunction['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedFunction['assembly'] !== null && this.selectedFunction['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'input':
        if (this.selectedFunction['input'] !== null && this.selectedFunction['input'].uri === propertyValue) {
          return;
        }
        break;
      case 'output':
        if (this.selectedFunction['output'] !== null && this.selectedFunction['output'].uri === propertyValue) {
          return;
        }
        break;
    }
    const functionInput = this._functionService.cloneFunctionInput(this.selectedFunction);
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(this.selectedFunction.coins.name,
        this.selectedFunction.coins.userID, this.selectedFunction.coins.description, this.selectedFunction.coins.creationDate);
    functionInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (functionInput[propertyLabel] ? functionInput[propertyLabel] : '<null>'));
    this._functionService.mutateFunction(functionInput, coinsObjectInput);
    this.propertyEdited = null;
  }
}
