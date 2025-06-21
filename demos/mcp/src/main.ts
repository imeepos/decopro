import "reflect-metadata"
import { bootstrap } from '@decopro/core'
import { CommanderAppInit } from "./commanders"
import { McpAppInit } from "./mcp"
import { McpTest } from "./tests"

bootstrap([
    CommanderAppInit,
    McpAppInit,
    McpTest
])