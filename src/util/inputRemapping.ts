import deepmerge from 'deepmerge';
import { OpaqueID } from './opaqueId';

export interface InputMapOptions {
  [key: string]: string;
}

export const BaseInputMapOptions: InputMapOptions = {
  'id': 'id'
};

export const RepositoryInputMapOptions: InputMapOptions = {
  ...BaseInputMapOptions,
  'repositoryId': 'repository.id',
  'repositoryName': 'repository.name',
  'repositorySlug': 'repository.slug',
};

// assumes the rest of the input is camelCase already and just capitalises the first letter
function lazyCamelCase(input: string): string {
  return input.substring(0, 1).toUpperCase() + input.substring(1);
}

// takes input object:
// 'repositoryId' => 'repository.id' => { repository: { id: ... } }
// 'repositorySlug' => 'repository.slug' => { repository: { slug: ... } }
export function remapInput(rootType: Function, options: InputMapOptions, input: { [key: string]: any }) {
  let output = input;

  for (const inputKey in options) {
    if (output.hasOwnProperty(inputKey)) {
      // transform it
      let baseValue = output[inputKey];
      const newName = options[inputKey].split('.');

      // transform/parse opaque ID if necessary
      let deepestKey = newName[newName.length - 1];
      if (deepestKey === 'id') {
        const typeName = newName.length > 1 ? lazyCamelCase(newName[newName.length - 2]) : rootType.name;
        baseValue = OpaqueID.decode(typeName, baseValue).dbId;
        deepestKey = 'dbId';
      }

      let wrapper = { [deepestKey]: baseValue };
      for (let i = newName.length - 2; i >= 0; i--) {
        wrapper = { [newName[i]]: wrapper };
      }

      output = deepmerge(output, wrapper);
      if (newName.length == 1 || newName[0] !== inputKey) {
        delete output[inputKey];
      }
    }
  }

  return output;
}