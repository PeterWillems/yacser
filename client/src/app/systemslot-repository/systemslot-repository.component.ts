import {Component, OnInit} from '@angular/core';
import {Dataset, SystemSlotInput, SystemSlot} from '../types';
import {SystemSlotService} from '../system-slot.service';
import {DatasetService} from '../dataset.service';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Subscription} from 'apollo-client/util/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnSortedEvent} from '../sort.service';

@Component({
  selector: 'app-systemslot-repository',
  templateUrl: './systemslot-repository.component.html',
  styleUrls: ['./systemslot-repository.component.css']
})
export class SystemslotRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  datasetId: number;
  selectedSystemSlot: SystemSlot;
  allSystemSlots: SystemSlot[];

  constructor(
    private _datasetService: DatasetService,
    private _systemSlotService: SystemSlotService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._systemSlotService.allSystemSlotsUpdated.subscribe((systemSlots) => {
        this.allSystemSlots = systemSlots;
        this.onSorted({sortDirection: 'asc', sortColumn: 'label'});
        this.route.params.subscribe(params => this.setSelectedSystemSlot(params['id']));
      });
      this._systemSlotService.queryAllSystemSlots(this.selectedDataset.datasetId);
    }
  }

  setSelectedSystemSlot(systemSlotUri: string) {
    if (systemSlotUri) {
      const element = document.getElementById(systemSlotUri);
      if (element && !this.isInViewport(element)) {
        element.scrollIntoView();
      }
      for (let index = 0; index < this.allSystemSlots.length; index++) {
        if (this.allSystemSlots[index].uri === systemSlotUri) {
          this.selectedSystemSlot = this.allSystemSlots[index];
          this._systemSlotService.selectedSystemSlot = this.selectedSystemSlot;
          break;
        }
      }
    } else {
      this.selectedSystemSlot = <SystemSlot>this.resetSelected(this._systemSlotService.selectedSystemSlot, this.allSystemSlots);
    }
  }

  onSelect(index: number): void {
    this.selectedSystemSlot = this.allSystemSlots[index];
    this._systemSlotService.selectedSystemSlot = this.selectedSystemSlot;
    this.router.navigate(['/systemslots', {id: this.selectedSystemSlot.uri}]);
  }

  onCreate(): void {
    const subscription = <Subscription>this._systemSlotService.systemSlotCreated.subscribe((value) => {
      this.selectedSystemSlot = value;
      this._systemSlotService.selectedSystemSlot = this.selectedSystemSlot;
      subscription.unsubscribe();
    });
    this._systemSlotService.createSystemSlot(new SystemSlotInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._systemSlotService.systemSlotDeleted.subscribe((value) => {
      this.selectedSystemSlot = null;
      this._systemSlotService.selectedSystemSlot = this.selectedSystemSlot;
      subscription.unsubscribe();
    });
    this._systemSlotService.deleteSystemSlot(this.allSystemSlots[index].datasetId, this.allSystemSlots[index].uri);
  }

  onSorted(criteria: ColumnSortedEvent): void {
    this.allSystemSlots = this.allSystemSlots.sort((a, b) => {
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
