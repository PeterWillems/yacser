import {Component, OnInit} from '@angular/core';
import {DatasetService} from '../dataset.service';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {SystemInterfaceService} from '../system-interface.service';
import {Dataset, Function, Requirement, SystemInterface} from '../types';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';

@Component({
  selector: 'app-function-repository',
  templateUrl: './function-repository.component.html',
  styleUrls: ['./function-repository.component.css']
})
export class FunctionRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  selectedFunction: Function;
  _selectedFunctionIndex: number;
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];

  constructor(
    private _datasetService: DatasetService,
    private _functionService: FunctionService,
    private _requirementService: RequirementService,
    private _systemInterfaceService: SystemInterfaceService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._functionService.allFunctionsUpdated.subscribe((functions) => {
        this.allFunctions = functions;
        this.selectedFunction = <Function>this.resetSelected(this.selectedFunction, functions);
      });
      this._functionService.queryAllFunctions(this.selectedDataset.datasetId);
      this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
      this._requirementService.queryAllRequirements(this.selectedDataset.datasetId);
      this._systemInterfaceService.allSystemInterfacesUpdated.subscribe((systemInterfaces) => this.allSystemInterfaces = systemInterfaces);
      this._systemInterfaceService.queryAllSystemInterfaces(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this._selectedFunctionIndex = index;
    this.selectedFunction = this.allFunctions[index];
  }
}
