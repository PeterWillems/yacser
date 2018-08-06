import {Component, Input, OnInit} from '@angular/core';
import {RealisationPort, Requirement} from '../../types';
import {SeObjectComponent} from '../../se-object-component';
import {RequirementService} from '../../requirement.service';
import {DatasetService} from '../../dataset.service';
import {RealisationModuleService} from '../../realisation-module.service';

@Component({
  selector: 'app-realisation-port',
  templateUrl: './realisation-port.component.html',
  styleUrls: ['./realisation-port.component.css']
})
export class RealisationPortComponent extends SeObjectComponent implements OnInit {
  @Input() selectedRealisationPort: RealisationPort;
  @Input() assemblyOptions: RealisationPort[];
  @Input() partOptions: RealisationPort[];
  allRequirements: Requirement[];

  constructor(private _datasetService: DatasetService,
              private _realisationModuleService: RealisationModuleService,
              private _requirementService: RequirementService) {
    super();
  }

  ngOnInit() {
    this._requirementService.allRequirementsUpdated.subscribe(requirements => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this._datasetService.getSelectedDataset().datasetId);
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedRealisationPort['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedRealisationPort['assembly'] !== null && this.selectedRealisationPort['assembly'].uri === propertyValue) {
          return;
        }
        break;
    }
    const realisationPortInput = this._realisationModuleService.cloneRealisationPortInput(this.selectedRealisationPort);
    realisationPortInput.datasetId = this._realisationModuleService.selectedRealisationModule.datasetId;
    console.log('selectedRealisationPort.datasetId: ' + this.selectedRealisationPort.datasetId);
    console.log('propertyLabel=' +
      propertyLabel + ' ' + (realisationPortInput[propertyLabel] ? realisationPortInput[propertyLabel] : '<null>'));
    realisationPortInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' +
      propertyLabel + ' ' + (realisationPortInput[propertyLabel] ? realisationPortInput[propertyLabel] : '<null>'));
    this._realisationModuleService.mutateRealisationPort(realisationPortInput);
    this.propertyEdited = null;  }

}
