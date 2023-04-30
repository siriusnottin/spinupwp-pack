import * as coda from "@codahq/packs-sdk";

// Servers

const ServerDiskSpaceSchema = coda.makeObjectSchema({
  properties: {
    total: { type: coda.ValueType.Number },
    available: { type: coda.ValueType.Number },
    used: { type: coda.ValueType.Number },
    updatedAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
  }
});

const ServerDatabaseSchema = coda.makeObjectSchema({
  properties: {
    server: { type: coda.ValueType.String },
    host: { type: coda.ValueType.String },
    port: { type: coda.ValueType.String } // FIXME: should be number. API returns string
  }
});

export const ServerSchema = coda.makeObjectSchema({
  properties: {
    serverId: { type: coda.ValueType.Number, required: true },
    name: { type: coda.ValueType.String, required: true },
    providerName: { type: coda.ValueType.String },
    ubuntuVersion: { type: coda.ValueType.String },
    ipAddress: { type: coda.ValueType.String },
    sshPort: { type: coda.ValueType.Number },
    timezone: { type: coda.ValueType.String },
    region: { type: coda.ValueType.String },
    size: { type: coda.ValueType.String },
    diskSpace: ServerDiskSpaceSchema,
    database: ServerDatabaseSchema,
    sshPublicKey: { type: coda.ValueType.String },
    gitPublicKey: { type: coda.ValueType.String },
    connectionStatus: { type: coda.ValueType.String },
    rebootRequired: { type: coda.ValueType.Boolean },
    upgradeRequired: { type: coda.ValueType.Boolean },
    installNotes: { type: coda.ValueType.String },
    createdAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.DateTime },
    status: { type: coda.ValueType.String },
    spinupUrl: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
  },
  idProperty: "serverId",
  displayProperty: "name",
});

// create relation between Server and Site
const ServerReferenceSchema = coda.makeReferenceSchemaFromObjectSchema(ServerSchema, "Server");

// Sites
const SiteAdditionalDomainsSchema = coda.makeObjectSchema({
  properties: {
    domain: { type: coda.ValueType.String },
    redirect: {
      type: coda.ValueType.Object,
      properties: {
        enabled: { type: coda.ValueType.Boolean },
      },
    },
    createdAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
  },
});

export const SiteNginxSchema = coda.makeObjectSchema({
  properties: {
    uploadsDirectoryProtected: { type: coda.ValueType.Boolean },
    xmlrpcProtected: { type: coda.ValueType.Boolean },
    subdirectoryRewriteInPlace: { type: coda.ValueType.Boolean },
  },
});

const SiteDatabaseSchema = coda.makeObjectSchema({
  properties: {
    databaseId: { type: coda.ValueType.Number, fromKey: "id" },
    userId: { type: coda.ValueType.Number },
    tablePrefix: { type: coda.ValueType.String },
  },
});

const SiteBackupsSchema = coda.makeObjectSchema({
  properties: {
    files: { type: coda.ValueType.Boolean },
    database: { type: coda.ValueType.Boolean },
    pathToExclude: { type: coda.ValueType.String },
    isBackupsRetentionPeriodEnabled: { type: coda.ValueType.Boolean },
    retentionPeriod: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Duration },
    nextRunTime: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
    storageProvider: {
      type: coda.ValueType.Object, properties: {
        storageProviderId: { type: coda.ValueType.Number },
        region: { type: coda.ValueType.String },
        bucket: { type: coda.ValueType.String },
      },
    },
  },
});

const SiteGitSchema = coda.makeObjectSchema({
  properties: {
    enabled: { type: coda.ValueType.Boolean },
    repo: { type: coda.ValueType.String },
    branch: { type: coda.ValueType.String },
    deployScript: { type: coda.ValueType.String },
    pushEnabled: { type: coda.ValueType.Boolean },
    deploymentUrl: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
  },
});

const SiteBasicAuthSchema = coda.makeObjectSchema({
  properties: {
    enabled: { type: coda.ValueType.Boolean },
    username: { type: coda.ValueType.String },
  },
});

export const SiteSchema = coda.makeObjectSchema({
  properties: {
    siteId: { type: coda.ValueType.Number },
    server: ServerReferenceSchema,
    domain: { type: coda.ValueType.String },
    additionalDomains: SiteAdditionalDomainsSchema,
    siteUser: { type: coda.ValueType.String },
    phpVersion: { type: coda.ValueType.String },
    publicFolder: { type: coda.ValueType.String },
    isWordpress: { type: coda.ValueType.Boolean },
    pageCache: { type: coda.ValueType.Object, properties: { enabled: { type: coda.ValueType.Boolean } } },
    https: { type: coda.ValueType.Object, properties: { enabled: { type: coda.ValueType.Boolean } } },
    nginx: SiteNginxSchema,
    database: SiteDatabaseSchema,
    backups: SiteBackupsSchema,
    wpCoreUpdate: { type: coda.ValueType.Boolean },
    wpThemeUpdates: { type: coda.ValueType.Number },
    wpPluginUpdates: { type: coda.ValueType.Number },
    git: SiteGitSchema,
    basicAuth: SiteBasicAuthSchema,
    createdAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
    status: { type: coda.ValueType.String },
    spinupUrl: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    siteUrl: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
    siteAdminUrl: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
  },
  idProperty: "siteId",
  displayProperty: "domain",
});

// Events
