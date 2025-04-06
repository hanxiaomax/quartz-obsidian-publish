---
title: "示例 PRD 文件及提问方式"
source: "https://gist.github.com/hellokaton/8eb4f3141ca13728c2bd7d877bcc425c"
author:
  - "[[Gist]]"
published:
created: 2025-04-05
description: "示例 PRD 文件及提问方式. GitHub Gist: instantly share code, notes, and snippets."
tags:
  - "clippings"
---
```
<context>
# Overview  
[Provide a high-level overview of your product here. Explain what problem it solves, who it's for, and why it's valuable.]

# Core Features  
[List and describe the main features of your product. For each feature, include:
- What it does
- Why it's important
- How it works at a high level]

# User Experience  
[Describe the user journey and experience. Include:
- User personas
- Key user flows
- UI/UX considerations]
</context>
<PRD>
# Technical Architecture  
[Outline the technical implementation details:
- System components
- Data models
- APIs and integrations
- Infrastructure requirements]

# Development Roadmap  
[Break down the development process into phases:
- MVP requirements
- Future enhancements
- Do not think about timelines whatsoever -- all that matters is scope and detailing exactly what needs to be build in each phase so it can later be cut up into tasks]

# Logical Dependency Chain
[Define the logical order of development:
- Which features need to be built first (foundation)
- Getting as quickly as possible to something usable/visible front end that works
- Properly pacing and scoping each feature so it is atomic but can also be built upon and improved as development approaches]

# Risks and Mitigations  
[Identify potential risks and how they'll be addressed:
- Technical challenges
- Figuring out the MVP that we can build upon
- Resource constraints]

# Appendix  
[Include any additional information:
- Research findings
- Technical specifications]
</PRD>
```


  
我们来规划一个 web 应用程序，我想创建一个名为 macwall 的应用，主要功能是：基于 Unsplash 获取 mac 壁纸进行显示和下载。

参考 @example_prd.txt 写一个 PRD 文件到 abc.txt 文件。