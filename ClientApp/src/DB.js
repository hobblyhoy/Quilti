import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './DBConfig';

// DB ETHOS
// In order to keep this from getting chaotic, this cache serves as a layer to represent the
// results from api requests and nothing more. Nothing going in or coming out should contain
// anything more or less than you'd receive from the server. We also only ever store objects
// once they're in their "completed" state. This means:
// - No decorated properties
// - No exotic data types
// - Patches contain an east/south/west/north and are Active (not enforced here)
// - PatchImages contain an image (should always be the case in my current architecture)
// This might sacrifice some efficiency but I'll take sanity over performance any day of the week.

export function db_init() {
   console.log('init');
   try {
      initDB(DBConfig);
   } catch {
      console.error('failed to initialize DB (probably already initialized)');
   }
}

export async function db_patch_insertSafe(patchParam) {
   let patch = { ...patchParam };
   console.log('in db_patch_insertSafe', patch);
   const db = useIndexedDB('patches');
   let existingVal = await db.getByID(patch.patchId);
   if (!existingVal) {
      // Strip out decorated properties
      Object.getOwnPropertyNames(patch).forEach(prop => {
         if (prop.startsWith('__')) delete patch[prop];
      });

      db.add(patch, patch.patchId);
   }
}

export async function db_patch_get(patchId) {
   const db = useIndexedDB('patches');
   return await db.getByID(patchId);
}

export async function db_patchImage_get(patchId) {
   const db = useIndexedDB('patchImages');
   let obj = await db.getByID(patchId);
   return obj && obj.image;
}

export async function db_patchImage_insertSafe(patchId, image) {
   const db = useIndexedDB('patchImages');
   let existingVal = await db.getByID(patchId);
   if (!existingVal) {
      db.add({ image }, patchId);
   }
}
