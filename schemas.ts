import * as coda from "@codahq/packs-sdk";

// Servers

const DatabaseSchema = coda.makeObjectSchema({
  properties: {
    server: { type: coda.ValueType.String },
    host: { type: coda.ValueType.String },
    port: { type: coda.ValueType.String },
  },
});

const DiskSpaceSchema = coda.makeObjectSchema({
  properties: {
    total: { type: coda.ValueType.Number },
    available: { type: coda.ValueType.Number },
    used: { type: coda.ValueType.Number },
    updatedAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
  },
});

export const ServerSchema = coda.makeObjectSchema({
  properties: {
    serverId: { type: coda.ValueType.Number },
    name: { type: coda.ValueType.String },
    providerName: { type: coda.ValueType.String },
    ubuntuVersion: { type: coda.ValueType.String },
    ipAddress: { type: coda.ValueType.String },
    sshPort: { type: coda.ValueType.Number },
    timezone: { type: coda.ValueType.String },
    region: { type: coda.ValueType.String },
    size: { type: coda.ValueType.String },
    diskSpace: DiskSpaceSchema,
    database: DatabaseSchema,
    sshPublicKey: { type: coda.ValueType.String },
    gitPublicKey: { type: coda.ValueType.String },
    connectionStatus: { type: coda.ValueType.String },
    rebootRequired: { type: coda.ValueType.Boolean },
    upgradeRequired: { type: coda.ValueType.Boolean },
    installNotes: { type: coda.ValueType.String },
    createdAt: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
    status: { type: coda.ValueType.String },
  },
  idProperty: "serverId",
  displayProperty: "name",
});

// Sites

// Events
