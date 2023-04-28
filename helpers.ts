import * as coda from "@codahq/packs-sdk";
import * as types from "./types";

// declare api url
export const ApiUrl = "https://api.spinupwp.app/v1";

function snakeToCamel(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key.replace(/_(\w)/g, (_, c) => c.toUpperCase()), value];
    })
  );
}

// ====================
// SERVERS
// ====================

function serverParser(servers: types.ServerResponse[]): types.Server[] {
  return servers.map((server) => {
    const modifiedServer = { ...server, serverId: server.id };
    delete modifiedServer.id;
    return snakeToCamel(modifiedServer) as types.Server;
  });
}

// return a list of servers
export async function SyncServers(context: coda.SyncExecutionContext): Promise<coda.GenericSyncFormulaResult> {
  let url = nextPageUrl ? nextPageUrl : `${ApiUrl}/servers`;
  const response = await context.fetcher.fetch({ method: "GET", url });
  const servers = response.body.data as types.ServerResponse[];
  let nextPageUrl = (response.body.pagination as types.ApiResponse["pagination"])?.next;
  return {
    result: serverParser(servers),
    continuation: nextPageUrl ? { nextPageUrl } : undefined,
  };
}

// sync table fn for the servers

// formula fn for a server info

// ====================
// SITES
// ====================

// parser fn for the applications api response
// return a list of applications

// sync table fn for the applications 

// formula fn for an application info
