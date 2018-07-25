import {SeObject} from './types';

export abstract class SeObjectComponent {
  propertyEdited: string;

  showList(list: Array<SeObject>): string {
    let showString = '';
    if (list) {
      showString += '[ ';
      for (let index = 0; index < list.length; index++) {
        showString += list[index].label;
        if (index < list.length - 1) {
          showString += ', ';
        }
      }
      showString += ' ]';
    }
    return showString;
  }

  onSessionStarted(propertyLabel: string) {
    if (this.propertyEdited && this.propertyEdited !== propertyLabel) {
      this.propertyEdited = null;
    } else {
      this.propertyEdited = (this.propertyEdited === propertyLabel) ? null : propertyLabel;
    }
  }

  abstract onSessionEnded(propertyValue: string, propertyLabel: string);
}
