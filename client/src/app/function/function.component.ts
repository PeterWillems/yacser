import {Component, Input, OnInit} from '@angular/core';
import {Function, Requirement, SystemInterface} from '../types';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SeObjectComponent} from '../se-object-component';
import {SystemInterfaceService} from '../system-interface.service';

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent extends SeObjectComponent implements OnInit {
  @Input() selectedFunction: Function;
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];

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

  onSessionEnded(propertyValue: string, propertyLabel: string) {
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
    functionInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (functionInput[propertyLabel] ? functionInput[propertyLabel] : '<null>'));
    this._functionService.mutateFunction(functionInput);
    this.propertyEdited = null;
  }
}
