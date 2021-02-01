export const DBConfig = {
   name: 'QuiltiDb',
   version: 1,
   objectStoresMeta: [
      {
         store: 'patches',
         storeConfig: { key: 'patchId' },
         storeSchema: [
            { name: 'patchId', keypath: 'patchId', options: { unique: true } },
            { name: 'x', keypath: 'x', options: { unique: false } },
            { name: 'y', keypath: 'y', options: { unique: false } },
            { name: 'imageMini', keypath: 'imageMini', options: { unique: false } },
            { name: 'objectStatus', keypath: 'objectStatus', options: { unique: false } },
         ],
      },
      {
         store: 'patchImages',
         storeConfig: { key: 'patchId' },
         storeSchema: [
            { name: 'patchId', keypath: 'patchId', options: { unique: true } },
            { name: 'image', keypath: 'image', options: { unique: false } },
         ],
      },
   ],
};
