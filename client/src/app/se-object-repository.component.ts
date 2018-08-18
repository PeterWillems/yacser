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

  isInViewport(elem) {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
