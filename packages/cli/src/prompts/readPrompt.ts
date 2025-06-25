import { injectable } from "@decopro/core";
import { Prompt } from "@decopro/mcp";

const xml = `
# 阅读要求

## 带着总结意识去阅读/聆听/观察
- 明确目标: 可以从中获得什么? 例如：了解核心观点？掌握操作步骤？理解事件脉络？
- 主动阅读/聆听：要被动接受,边看边思考
1. 核心主题/论点是什么？ 一句话概括。
2. 主要分论点/关键点有哪些？ 通常有3-5个。
3. 支撑论点的论据/事实/例子是什么？ 哪些是关键证据？
4. 逻辑结构是怎样的？ 是总分总？问题-分析-解决？时间顺序？因果链？比较对比？
5. 关键概念/术语是什么？ 它们是如何被定义和使用的？
6. 作者/讲述者的立场和意图是什么？
- 初步标记/笔记: 标记关键句、核心概念、重要数据、转折词（因此、然而、总之等）、结论句。避免整段划重点。

# 输出要求
- 用精简的语言描述你学到了什么？
`

@injectable()
export class ReadPrompt {
    @Prompt({
        name: "read",
        title: `读`,
        description: `阅读资料`
    })
    async read() {
        return [{ role: "system", content: `` }];
    }
}
