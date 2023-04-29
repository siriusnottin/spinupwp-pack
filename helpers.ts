import * as coda from "@codahq/packs-sdk";
import * as types from "./types";

// declare api url
export const ApiUrl = "https://api.spinupwp.app/v1";

function snakeToCamel(obj: { [key: string]: any }) {
  // transform snake_case to camelCase
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key.replace(/_(\w)/g, (_, c) => c.toUpperCase()), value];
    })
  );
}

// ====================
// SERVERS
// ====================

function BytesToGigaBytes(bytes: number): number {
  return bytes / 1000000000;
}

function serversParser(servers: types.ServerResponse[]): types.Server[] {
  return servers.map((server) => {
    const { id, disk_space, ...rest } = server;
    const parsedDiskSpace = {};
    for (const prop in disk_space) {
      parsedDiskSpace[prop] = (prop === "updated_at") ? disk_space[prop] : BytesToGigaBytes(disk_space[prop]);
    };
    const parsedServer = {
      serverId: id,
      ...rest,
      diskSpace: parsedDiskSpace,
    };
    return snakeToCamel(parsedServer) as types.Server;
  });
}

export async function SyncServers(context: coda.SyncExecutionContext): Promise<coda.GenericSyncFormulaResult> {
  const url = (context.sync.continuation?.nextPageUrl as string | undefined) || `${ApiUrl}/servers`
  const response = await context.fetcher.fetch({ method: "GET", url }) as types.ApiResponse;
  const servers = response.body.data as types.ServerResponse[] | undefined;
  const nextUrl = response.body.pagination.next;
  return {
    result: (servers) ? serversParser(servers) : undefined,
    continuation: (nextUrl) ? { nextPageUrl: nextUrl } : undefined,
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
