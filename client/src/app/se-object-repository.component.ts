import {SeObject} from './types';

export class SeObjectRepositoryComponent {

  localName(seObject: SeObject): string {
    const hashMarkIndex = seObject.uri.indexOf('#');
    return seObject.uri.substring(hashMarkIndex);
  }

  show(object: SeObject): string {
    return object ? object.label : '';
  }

  resetSelected(selectedObject: SeObject, repository: SeObject[]): SeObject {
    if (selectedObject) {
      for (let index = 0; index < repository.length; index++) {
        if (repository[index].uri === selectedObject.uri) {
          return repository[index];
        }
      }
    }
    return null;
  }
}
