import axios from 'axios';
import { db_patchImage_get, db_patchImage_insertSafe, db_patch_get, db_patch_insertSafe } from './DB';

import { util_createEmptyPatchDecFromPatchId, util_createPatchDecFromPatch } from './Utilities';

// This layer is responsible for all requests to the server and getting/storing in indexedDb when appropriate
// Patches are always returned in our frontend/friendly way with decorated properties
// They are never stored in the DB with these features, though

// 2 main objects at play here, "Patch" and "PatchDec". PatchDec being the same as a Patch except
// customized / decorated specifically for our uses in the frontend.

// Patch:
// patchId string
// x int
// y int
// imageMini string
// objectStatus string

//PatchDec:
// patchId string
// x int
// y int
// src string
// status string (new, empty, reserved, partial, full)
// TODO revisit this, it may never make sense to have a "new" status
// PatchDec status is similar but different from the db based statuses in that these contain extra states
// (new, empty, partial, full) so we can add in empty patches in our grid and to track it's progress
// through the app when applying full size images (partial // full)

export async function api_getInitialPatchDec() {
   if (arguments.length !== 0) throw 'invalid args in api_getInitialPatchDec';

   let resp = await axios.get('/api/Patch');
   return util_createPatchDecFromPatch(resp.data);
}

export async function api_getPatchDec(patchId) {
   if (arguments.length !== 1) throw 'invalid args in api_getPatchDec';

   let patch = await db_patch_get(patchId);

   if (!patch) {
      let resp = await axios.get('/api/Patch/' + patchId);
      patch = resp.data;

      if (patch && patch.objectStatus === 'ACT') await db_patch_insertSafe(patch);
   }

   // if we still don't have a patch by this point we're looking at an empty spot
   if (!patch) return util_createEmptyPatchDecFromPatchId(patchId);

   return util_createPatchDecFromPatch(patch);
}

export async function api_getPatchImage(patchId) {
   if (arguments.length !== 1) throw 'invalid args in api_getPatchImage';

   let patchImage = await db_patchImage_get(patchId);

   if (!patchImage) {
      let resp = await axios.get('/api/PatchImage/' + patchId);
      patchImage = resp.data;

      if (patchImage) await db_patchImage_insertSafe(patchId, patchImage);
   }

   return patchImage;
}

export async function api_getPatchIdsInRange(leftX, rightX, topY, bottomY) {
   if (arguments.length !== 4) throw 'invalid args in api_getPatchDec';

   let resp = await axios.get(`/api/PatchGroup/${leftX}/${rightX}/${topY}/${bottomY}`);
   return resp.data;
}

export async function api_reservePatch(patchId) {
   if (arguments.length !== 1) throw 'invalid args in api_getPatchDec';

   let resp = await axios.post('/api/Patch/' + patchId);
   return resp.data;
}

// TODO we need some kind of global error handler here, we only have a few key events I
//  think they could be tied all into the same kind of central notification system
