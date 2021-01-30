export const DBConfig = {
   name: 'QuiltiDb',
   version: 1,
   objectStoresMeta: [
      {
         store: 'patches',
         storeConfig: { key: 'patchId' },
         storeSchema: [
            { name: 'patchId', keypath: 'patchId', options: { unique: false } },
            { name: 'northPatchId', keypath: 'northPatchId', options: { unique: false } },
            { name: 'southPatchId', keypath: 'southPatchId', options: { unique: false } },
            { name: 'eastPatchId', keypath: 'eastPatchId', options: { unique: false } },
            { name: 'imageMini', keypath: 'imageMini', options: { unique: false } },
            { name: 'objectStatus', keypath: 'objectStatus', options: { unique: false } },
         ],
      },
      {
         store: 'patchImages',
         storeConfig: { key: 'patchId' },
         storeSchema: [
            { name: 'patchId', keypath: 'patchId', options: { unique: false } },
            { name: 'image', keypath: 'image', options: { unique: false } },
         ],
      },
   ],
};
