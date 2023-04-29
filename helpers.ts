import * as coda from "@codahq/packs-sdk";
import * as types from "./types";

// declare api url
export const AppUrl = "https://spinupwp.app";
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
      spinupUrl: `${AppUrl}/servers/${id}`,
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

// formula fn for a server info

// ====================
// SITES
// ====================

function sitesParser(sites: types.SiteResponse[]): types.Site[] {
  return sites.map((site) => {
    const { id, https, domain, is_wordpress, ...rest } = site;
    const server: types.Site["server"] = {
      serverId: site.server_id,
      name: "Not found",
    }
    const siteUrl = `${https.enabled ? 'https' : 'http'}://${domain}`;
    const modifiedSite = {
      siteId: id,
      server,
      ...site,
      spinupUrl: `${AppUrl}/sites/${id}`,
      siteUrl,
      siteAdminUrl: (is_wordpress) ? `${siteUrl}/wp-admin` : undefined,
    };
    delete modifiedSite.id, modifiedSite.server_id; // we dont need these returned in the formula
    return snakeToCamel(modifiedSite) as types.Site;
  });
}

export async function SyncSites(context: coda.SyncExecutionContext): Promise<coda.GenericSyncFormulaResult> {
  let url = (context.sync.continuation?.nextPageUrl as string | undefined) || `${ApiUrl}/sites`
  url = coda.withQueryParams(url, { limit: 100 });
  const response = await context.fetcher.fetch({ method: "GET", url }) as types.ApiResponse;
  const sites = response.body.data as types.SiteResponse[] | undefined;
  const nextUrl = response.body.pagination.next;
  return {
    result: (sites) ? sitesParser(sites) : undefined,
    continuation: (nextUrl) ? { nextPageUrl: nextUrl } : undefined,
  };
}

// return a list of applications

// sync table fn for the applications 

// formula fn for an application info
