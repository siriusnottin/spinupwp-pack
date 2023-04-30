// servers

enum ServerStatus {
  Provisioning = "provisioning",
  Provisioned = "provisioned",
  Failed = "failed",
}

export interface ServerResponse {
  id: number;
  name: string;
  provider_name: string;
  ubuntu_version: string;
  ip_address: string;
  ssh_port: number;
  timezone: string;
  region: string;
  size: string;
  disk_space: {
    total: number;
    available: number;
    used: number;
    updated_at: string;
  };
  database: {
    server: string;
    host: string;
    port: number;
  };
  ssh_publickey: string;
  git_publickey: string;
  connection_status: "connected" | "disconnected";
  reboot_required: boolean;
  upgrade_required: boolean;
  install_notes: string | null;
  created_at: string;
  status: ServerStatus;
}

export interface Server {
  serverId: number;
  name: string;
  providerName: string;
  ubuntuVersion: string;
  ipAddress: string;
  sshPort: number;
  timezone: string;
  region: string;
  size: string;
  diskSpace: {
    total: number;
    available: number;
    used: number;
    updatedAt: string;
  };
  database: {
    server: string;
    host: string;
    port: number;
  };
  sshPublicKey: string;
  gitPublicKey: string;
  connectionStatus: string;
  rebootRequired: boolean;
  upgradeRequired: boolean;
  installNotes: string | null;
  createdAt: string;
  status: ServerStatus;
  spinupUrl: string;
}

interface ServerReference {
  serverId: number;
  name: "Not found";
}

// sites

enum SiteStatus {
  Deployed = "deployed",
  Deploying = "deploying",
  Failed = "failed",
}

export interface SiteResponse {
  id: number;
  server_id: number;
  domain: string;
  additional_domains: {
    domain: string;
    redirect: {
      enabled: boolean;
    };
    created_at: string;
  }[];
  site_user: string;
  user_auth: string;
  php_version: string;
  public_folder: string;
  is_wordpress: boolean;
  page_cache: {
    enabled: boolean;
  };
  https: {
    enabled: boolean;
    certificate_path?: string;
    private_key_path?: string;
    certificate_expires?: string;
    certificate_renews?: string;
  };
  nginx: {
    uploads_directory_protected: boolean;
    xmlrpc_protected: boolean;
    subdirectory_rewrite_in_place: boolean;
  };
  database: {
    id: number;
    user_id: number;
    table_prefix: string;
  };
  backups: {
    files: boolean;
    database: boolean;
    paths_to_exclude: string;
    is_backups_retention_period_enabled: boolean;
    retention_period: number;
    next_run_time: string | null;
    storage_provider: {
      id: number | null;
      region: string | null;
      bucket: string | null;
    };
  };
  wp_core_update: boolean;
  wp_theme_updates: number;
  wp_plugin_updates: number;
  git: {
    enabled: boolean;
    repo?: string;
    branch?: string;
    deploy_script?: string;
    push_enabled?: boolean;
    deployment_url?: string;
  };
  basic_auth: {
    enabled: boolean;
    username?: string;
  };
  created_at: string;
  status: SiteStatus;
};

export interface Site {
  siteId: number;
  server: ServerReference;
  domain: string;
  additionalDomains: {
    domain: string;
    redirect: {
      enabled: boolean;
    };
    createdAt: string;
  }[];
  siteUser: string;
  userAuth: string;
  phpVersion: string;
  publicFolder: string;
  isWordpress: boolean;
  pageCacheEnabled: boolean;
  https: {
    name: "https"
    enabled: boolean;
    certificatePath?: string;
    privateKeyPath?: string;
    certificateExpires?: string;
    certificateRenews?: string;
  };
  nginx: {
    name: "nginx";
    uploadsDirectoryProtected: boolean;
    xmlrpcProtected: boolean;
    subdirectoryRewriteInPlace: boolean;
  };
  database: {
    databaseId: number;
    userId: number;
    tablePrefix: string;
  };
  backups: {
    files: boolean;
    database: boolean;
    pathsToExclude: string;
    isBackupsRetentionPeriodEnabled: boolean;
    retentionPeriod: number;
    nextRunTime: string | null;
    storageProvider: {
      id: number;
      region: string;
      bucket: string;
    };
  } | null;
  wpCoreUpdate: boolean;
  wpThemeUpdates: number;
  wpPluginUpdates: number;
  git: {
    name: "Git";
    enabled: boolean;
    repo: string;
    branch: string;
    deployScript: string;
    pushEnabled: boolean;
    deploymentUrl: string;
  };
  basicAuth: {
    name: "Basic Auth";
    enabled: boolean;
    username?: string;
  };
  createdAt: string;
  status: SiteStatus;
  spinupUrl: string;
  siteUrl: string;
  siteAdminUrl: string | null;
}

interface SiteReference {
  siteId: number;
  domain: "Not found";
}

enum EventStatus {
  Queued = "queued",
  Creating = "creating",
  Updating = "updating",
  Deleting = "deleting",
  Deployed = "deployed",
  Failed = "failed"
}

// events

export interface EventResponse {
  id: number;
  initiated_by: string;
  server_id?: number;
  site_id?: number;
  name: string;
  status: EventStatus;
  output: string | null;
  created_at: string;
  started_at: string;
  finished_at: string;
}

export interface Event {
  eventId: number;
  initiatedBy: string;
  server: ServerReference;
  site: SiteReference;
  name: string;
  status: EventStatus;
  output: string | null;
  createdAt: string;
  startedAt: string;
  finishedAt: string;
}


// Generic api response types

//  Error response
enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  ValidationError = 422,
  TooManyAttempts = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503
}

const errorCodeMeaning: { [key in ErrorCode]: string } = {
  [ErrorCode.BadRequest]: 'Bad Request — Your request is invalid.',
  [ErrorCode.Unauthorized]: 'Unauthorized — Your API token is wrong or no longer valid.',
  [ErrorCode.PaymentRequired]: 'Payment Required — The team does not have a valid subscription.',
  [ErrorCode.Forbidden]: 'Forbidden — You do not have permission to access the endpoint.',
  [ErrorCode.NotFound]: 'Not Found — The specified resource could not be found.',
  [ErrorCode.MethodNotAllowed]: 'Method Not Allowed — You tried to access an endpoint with an invalid method.',
  [ErrorCode.ValidationError]: 'Validation Error — Invalid or missing parameters.',
  [ErrorCode.TooManyAttempts]: 'Too Many Attempts — You\'ve hit the rate limit on API requests.',
  [ErrorCode.InternalServerError]: 'Internal Server Error — We had a problem with our server. Try again later.',
  [ErrorCode.ServiceUnavailable]: 'Service Unavailable — We\'re temporarily offline for maintenance. Please try again later.'
};

export interface ApiResponse {
  body: {
    data: ServerResponse[] | SiteResponse[] | EventResponse[] | undefined
    pagination: {
      previous: string | null;
      next: string | null;
      per_page: number;
      count: number;
    };
  };
}
