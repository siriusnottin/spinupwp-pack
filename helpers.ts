import * as coda from "@codahq/packs-sdk";
import * as types from "./types";

// declare api url
export const AppUrl = "https://spinupwp.app";
export const ApiUrl = "https://api.spinupwp.app/v1";

export async function syncWithContinuation(context: coda.SyncExecutionContext, baseUrl: string, urlQueryParams: { [key: string]: any }, parser: (data: any) => any): Promise<coda.GenericSyncFormulaResult> {
  // high-end fn that handles sync with continuation
  let url = (context.sync.continuation?.nextPageUrl as string | undefined) || baseUrl;
  url = coda.withQueryParams(url, urlQueryParams);
  const response = await context.fetcher.fetch({ method: "GET", url }) as types.ApiResponse;
  const data = response.body.data as any[] | undefined;
  const nextUrl = response.body.pagination.next;
  return {
    result: (data) ? parser(data) : undefined,
    continuation: (nextUrl) ? { nextPageUrl: nextUrl } : undefined,
  };
}

function snakeToCamel(obj: { [key: string]: any }) {
  // transform obj key from snake_case to camelCase (e.g. server_id -> serverId)

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        return [key.replace(/_(\w)/g, (_, c) => c.toUpperCase()), snakeToCamel(value)];
      })
    );
  }
  return obj;
}

// ====================
// SERVERS
// ====================

function BytesToGigaBytes(bytes: number): number {
  return bytes / 1000000000;
}

export function serversParser(servers: types.ServerResponse[]): types.Server[] {
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

// formula fn for a server info

// ====================
// SITES
// ====================

export function sitesParser(sites: types.SiteResponse[]): types.Site[] {
  return sites.map((site) => {
    const { id, https, domain, page_cache, backups, is_wordpress } = site;
    const server: types.Site["server"] = {
      serverId: site.server_id,
      name: "Not found",
    }
    const { files, database } = backups;
    const siteUrl = `${https.enabled ? 'https' : 'http'}://${domain}`;
    const modifiedSite = {
      ...site,
      siteId: id,
      server,
      pageCacheEnabled: page_cache.enabled,
      backups: (files || database) ? backups : undefined,
      spinupUrl: `${AppUrl}/sites/${id}`,
      siteUrl,
      siteAdminUrl: (is_wordpress) ? `${siteUrl}/wp-admin` : undefined,
    };
    return snakeToCamel(modifiedSite) as types.Site;
  });
}

// formula fn for an application info

// ====================
// EVENTS
// ====================

export function eventsParser(events: types.EventResponse[]): types.Event[] {
  return events.map((event) => {
    const { id, server_id, site_id, ...rest } = event;
    const server: types.Event["server"] = {
      serverId: server_id,
      name: "Not found",
    }
    const site: types.Event["site"] = {
      siteId: site_id,
      domain: "Not found",
    }
    const parsedEvent = {
      ...rest,
      eventId: id,
      server: (server.serverId) ? server : undefined,
      site: (site.siteId) ? site : undefined
    };
    console.log("parsedEvent", parsedEvent);
    return snakeToCamel(parsedEvent) as types.Event;
  });
}
