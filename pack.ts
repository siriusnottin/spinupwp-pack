import * as coda from "@codahq/packs-sdk";
import * as schemas from "./schemas";
import * as helpers from "./helpers";


export const pack = coda.newPack();

pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: `${helpers.AppUrl}/settings#api-tokens`,
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
      const url = `${helpers.ApiUrl}/servers`;
      const urlQueryParams = { limit: 1 };
      return await helpers.syncWithContinuation(context, url, urlQueryParams, helpers.serversParser);
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
      const url = `${helpers.ApiUrl}/sites`;
      const urlQueryParams = { limit: 100 };
      return await helpers.syncWithContinuation(context, url, urlQueryParams, helpers.sitesParser);
    },
  },
});

pack.addSyncTable({
  name: "Events",
  schema: schemas.EventSchema,
  identityName: "Event",
  formula: {
    name: "SyncEvents",
    description: "Sync events",
    parameters: [],
    execute: async function ([], context) {
      const url = `${helpers.ApiUrl}/events`;
      const urlQueryParams = { limit: 100 };
      return await helpers.syncWithContinuation(context, url, urlQueryParams, helpers.eventsParser);
    },
  },
});
