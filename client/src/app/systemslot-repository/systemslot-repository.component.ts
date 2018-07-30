import {Component, OnInit} from '@angular/core';
import {Dataset, SystemSlotInput, SystemSlot} from '../types';
import {SystemSlotService} from '../system-slot.service';
import {DatasetService} from '../dataset.service';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Subscription} from 'apollo-client/util/Observable';

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
    private _systemSlotService: SystemSlotService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._systemSlotService.allSystemSlotsUpdated.subscribe((systemSlots) => {
        this.allSystemSlots = systemSlots;
        this.selectedSystemSlot = <SystemSlot>this.resetSelected(this._systemSlotService.selectedSystemSlot, systemSlots);
      });
      this._systemSlotService.queryAllSystemSlots(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this.selectedSystemSlot = this.allSystemSlots[index];
    this._systemSlotService.selectedSystemSlot = this.selectedSystemSlot;
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
}
