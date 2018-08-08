import {Component, Input, OnInit} from '@angular/core';
import {PortRealisation, RealisationPort, SystemInterface} from '../../types';
import {SeObjectComponent} from '../../se-object-component';
import {HamburgerService} from '../../hamburger.service';
import {SystemInterfaceService} from '../../system-interface.service';
import {DatasetService} from '../../dataset.service';
import {RealisationModuleService} from '../../realisation-module.service';

@Component({
  selector: 'app-portrealisation',
  templateUrl: './portrealisation.component.html',
  styleUrls: ['./portrealisation.component.css']
})
export class PortrealisationComponent extends SeObjectComponent implements OnInit {
  @Input() selectedPortRealisation: PortRealisation;
  @Input() assemblyOptions: PortRealisation[];
  @Input() partOptions: PortRealisation[];
  @Input() interfaceOptions: SystemInterface[];
  @Input() portOptions: RealisationPort[];


  constructor(private _hamburgerService: HamburgerService,
              private _datasetService: DatasetService) {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedPortRealisation['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedPortRealisation['assembly'] !== null && this.selectedPortRealisation['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'systemInterface':
        if (this.selectedPortRealisation['systemInterface'] !== null
          && this.selectedPortRealisation['systemInterface'].uri === propertyValue) {
          return;
        }
        break;
    }
    const portRealisationInput = this._hamburgerService.clonePortRealisationInput(this.selectedPortRealisation);
    portRealisationInput.datasetId = this._hamburgerService.selectedHamburger.datasetId;
    console.log('selectedPortRealisation.datasetId: ' + this.selectedPortRealisation.datasetId);
    console.log('propertyLabel=' +
      propertyLabel + ' ' + (portRealisationInput[propertyLabel] ? portRealisationInput[propertyLabel] : '<null>'));
    portRealisationInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' +
      propertyLabel + ' ' + (portRealisationInput[propertyLabel] ? portRealisationInput[propertyLabel] : '<null>'));
    this._hamburgerService.mutatePortRealisation(portRealisationInput);
    this.propertyEdited = null;
  }
}
