import { generateTSKnowledges } from '@decopro/docs'
import { join } from 'path'
const root = process.cwd()
const knowledges = generateTSKnowledges(join(root, 'packages/cli'))
