
# 语法

```ebnf
(* EBNF形式化定义 *)
execution_element ::= '<execution' attributes? '>' content '</execution>'
attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*
content ::= (markdown_content | process_element | guideline_element | rule_element | constraint_element | criteria_element)+

process_element ::= '<process' attributes? '>' markdown_content '</process>'
guideline_element ::= '<guideline' attributes? '>' markdown_content '</guideline>'
rule_element ::= '<rule' attributes? '>' markdown_content '</rule>'
constraint_element ::= '<constraint' attributes? '>' markdown_content '</constraint>'
criteria_element ::= '<criteria' attributes? '>' markdown_content '</criteria>'

markdown_content ::= (* 任何有效的Markdown文本，可包含特定语法元素 *)
```

```ebnf
(* EBNF形式化定义 *)
resource_element ::= '<resource' ' protocol="' protocol_name '"' '>' content '</resource>'
protocol_name ::= [a-zA-Z][a-zA-Z0-9_-]*
content ::= (markdown_content | location_element | params_element | registry_element)+

location_element ::= '<location>' markdown_content '</location>'
params_element ::= '<params>' markdown_content '</params>'
registry_element ::= '<registry>' markdown_content '</registry>'

markdown_content ::= (* 任何有效的Markdown文本，包括代码块、表格等 *)
```

```ebnf
resource_reference ::= ('[@]' | '@!' | '@?') protocol_name ':' resource_location [query_params]
resource_location ::= uri | nested_reference
uri ::= protocol_name '://' path
nested_reference ::= ['[@]' | '@!' | '@?'] protocol_name ':' resource_location
path ::= path_segment {'/' path_segment}
query_params ::= '?' param_name '=' param_value {'&' param_name '=' param_value}
```

```ebnf
(* EBNF形式化定义 *)
role_element ::= '<role' attributes? '>' role_content '</role>'
role_content ::= personality_element principle_element knowledge_element

(* 三大核心组件 *)
personality_element ::= '<personality' attributes? '>' personality_content '</personality>'
principle_element ::= '<principle' attributes? '>' principle_content '</principle>'
knowledge_element ::= '<knowledge' attributes? '>' knowledge_content '</knowledge>'

(* 内容定义 *)
personality_content ::= markdown_content
principle_content ::= markdown_content
knowledge_content ::= markdown_content

attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*

markdown_content ::= (* 符合Markdown语法的内容 *)
```

```ebnf
(* EBNF形式化定义 *)
terminologies_element ::= '<terminologies>' terminology+ '</terminologies>'
terminology_element ::= '<terminology>' terminology_content '</terminology>'
terminology_content ::= zh_element en_element definition_element examples_element
zh_element ::= '<zh>' text '</zh>'
en_element ::= '<en>' text '</en>'
definition_element ::= '<definition>' markdown_content '</definition>'
examples_element ::= '<examples>' example+ '</examples>'
example_element ::= '<example>' markdown_content '</example>'

text ::= (* 任何文本内容 *)
markdown_content ::= (* 任何有效的Markdown文本 *)
```

```ebnf
(* EBNF形式化定义 *)
thought_element ::= '<thought' attributes? '>' content '</thought>'
attributes ::= (' ' attribute)+ | ''
attribute ::= name '="' value '"'
name ::= [a-zA-Z][a-zA-Z0-9_-]*
value ::= [^"]*
content ::= (markdown_content | exploration_element | reasoning_element | plan_element | challenge_element)+
markdown_content ::= (* 任何有效的Markdown文本，包括Mermaid图表 *)

exploration_element ::= '<exploration' attributes? '>' markdown_content '</exploration>'
reasoning_element ::= '<reasoning' attributes? '>' markdown_content '</reasoning>'
plan_element ::= '<plan' attributes? '>' markdown_content '</plan>'
challenge_element ::= '<challenge' attributes? '>' markdown_content '</challenge>'
```
