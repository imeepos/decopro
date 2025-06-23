import "reflect-metadata";
import { bootstrap } from "@decopro/core";
import { McpAppInit } from "./mcp";
import { McpTest } from "./tests";

bootstrap([McpAppInit, McpTest]);
