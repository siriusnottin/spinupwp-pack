import * as coda from "@codahq/packs-sdk";
import * as schemas from "./schemas";
import * as helpers from "./helpers";


export const pack = coda.newPack();

pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://spinupwp.app/settings#api-tokens",
});

pack.addNetworkDomain("api.spinupwp.app");

pack.addSyncTable({
  name: "Servers",
  schema: schemas.ServerSchema,
  identityName: "Server",
  formula: {
    name: "SyncServers",
    description: "Sync servers",
    parameters: [],
    execute: async function ([], context) {
      return helpers.SyncServers(context);
    },
  },
});

pack.addSyncTable({
  name: "Sites",
  schema: schemas.SiteSchema,
  identityName: "Site",
  formula: {
    name: "SyncSites",
    description: "Sync sites",
    parameters: [],
    execute: async function ([], context) {
      return helpers.SyncSites(context);
    },
  },
});
