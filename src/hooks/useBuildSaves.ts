import useLocalStorageState from 'use-local-storage-state';
import { BuildJSON } from '../types';

export type BuildSave = {
  addedAt: string;
  build: BuildJSON;
};

const useBuildSaves = () => {
  return useLocalStorageState<BuildSave[]>(`builds`, {
    defaultValue: [],
  });
};

export default useBuildSaves;
