import {Component, OnInit} from '@angular/core';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Dataset, SystemInterface, SystemInterfaceInput} from '../types';
import {DatasetService} from '../dataset.service';
import {Subscription} from 'apollo-client/util/Observable';
import {SystemInterfaceService} from '../system-interface.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnSortedEvent} from '../sort.service';

@Component({
  selector: 'app-systeminterface-repository',
  templateUrl: './systeminterface-repository.component.html',
  styleUrls: ['./systeminterface-repository.component.css']
})
export class SysteminterfaceRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  datasetId: number;
  selectedSystemInterface: SystemInterface;
  allSystemInterfaces: SystemInterface[];

  constructor(
    private _datasetService: DatasetService,
    private _systemInterfaceService: SystemInterfaceService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._systemInterfaceService.allSystemInterfacesUpdated.subscribe((systemInterfaces) => {
        this.allSystemInterfaces = systemInterfaces;
        this.onSorted({sortDirection: 'asc', sortColumn: 'label'});
        this.route.params.subscribe(params => this.setSelectedSystemInterface(params['id']));
      });
      this._systemInterfaceService.queryAllSystemInterfaces(this.selectedDataset.datasetId);
    }
  }

  setSelectedSystemInterface(systemInterfaceUri: string) {
    if (systemInterfaceUri) {
      const element = document.getElementById(systemInterfaceUri);
      if (element && !this.isInViewport(element)) {
        element.scrollIntoView();
      }
      for (let index = 0; index < this.allSystemInterfaces.length; index++) {
        if (this.allSystemInterfaces[index].uri === systemInterfaceUri) {
          this.selectedSystemInterface = this.allSystemInterfaces[index];
          this._systemInterfaceService.selectedSystemInterface = this.selectedSystemInterface;
          break;
        }
      }
    } else {
      this.selectedSystemInterface =
        <SystemInterface>this.resetSelected(this._systemInterfaceService.selectedSystemInterface, this.allSystemInterfaces);
    }
  }

  onSelect(index: number): void {
    this.selectedSystemInterface = this.allSystemInterfaces[index];
    this._systemInterfaceService.selectedSystemInterface = this.selectedSystemInterface;
    this.router.navigate(['/systeminterfaces', {id: this.selectedSystemInterface.uri}]);
  }

  onCreate(): void {
    const subscription = <Subscription>this._systemInterfaceService.systemInterfaceCreated.subscribe((value) => {
      this.selectedSystemInterface = value;
      this._systemInterfaceService.selectedSystemInterface = this.selectedSystemInterface;
      subscription.unsubscribe();
    });
    this._systemInterfaceService
      .createSystemInterface(new SystemInterfaceInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._systemInterfaceService.systemInterfaceDeleted.subscribe((value) => {
      this.selectedSystemInterface = null;
      this._systemInterfaceService.selectedSystemInterface = this.selectedSystemInterface;
      subscription.unsubscribe();
    });
    this._systemInterfaceService.deleteSystemInterface(this.allSystemInterfaces[index].datasetId, this.allSystemInterfaces[index].uri);
  }

  onSorted(criteria: ColumnSortedEvent): void {
    this.allSystemInterfaces = this.allSystemInterfaces.sort((a, b) => {
      if (criteria.sortDirection === 'desc') {
        switch (criteria.sortColumn) {
          case 'label':
            return (a.label < b.label) ? 1 : -1;
          case 'localName':
            return (this.localName(a) < this.localName(b)) ? 1 : -1;
          case 'assembly':
            return (this.show(a.assembly) < this.show(b.assembly)) ? 1 : -1;
        }
      } else {
        switch (criteria.sortColumn) {
          case 'label':
            return (a.label > b.label) ? 1 : -1;
          case 'localName':
            return (this.localName(a) > this.localName(b)) ? 1 : -1;
          case 'assembly':
            return (this.show(a.assembly) > this.show(b.assembly)) ? 1 : -1;
        }
      }
    });
  }
}
