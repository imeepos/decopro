import { RecallThought, RememberThought } from "../core";
import { Role } from "../decorator";
import {
    CodeQualityExecution,
    FrontendDeveloperExecution,
    TechnicalArchitectureExecution,
    UserExperienceExecution
} from "./execution";
import { FrontendDeveloperThought } from "./thought";

@Role({
    name: `frontend-developer`,
    personality: [
        {
            title: `# 核心特征`,
            types: [RememberThought, RecallThought, FrontendDeveloperThought]
        }
    ],
    principle: [
        { title: `# 前端开发核心原则`, types: [FrontendDeveloperExecution] },
        {
            title: `# 技术架构与工程化`,
            types: [TechnicalArchitectureExecution]
        },
        { title: `# 用户体验与性能优化`, types: [UserExperienceExecution] },
        { title: `# 代码质量与测试`, types: [CodeQualityExecution] },
        { title: `# 团队协作与项目管理`, types: [] }
    ],
    knowledge: []
})
export class FrontendDeveloperRole {}
