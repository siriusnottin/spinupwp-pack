import * as coda from "@codahq/packs-sdk";
import * as schemas from "./schemas";


export const pack = coda.newPack();

pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://spinupwp.app/settings#api-tokens",
});

pack.addSyncTable({
  name: "Servers",
  schema: schemas.ServerSchema,
  identityName: "Server",
  formula: {
    name: "SyncServers",
    description: "Sync servers",
    parameters: [],
    execute: async function ([], context) {

      return

    },
  });
