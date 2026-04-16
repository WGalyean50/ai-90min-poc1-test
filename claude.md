# Claude Code Project Resources

This file documents all available commands, skills, and agents accessible through your personal `.claude` folder.

---

## Commands

Commands are invoked with `/command-name` and automate complex workflows.

### Planning & Requirements
- **/plan** - Generate PRD and execution plan with agent approval
- **/spec** - Comprehensive specification analysis with backend, frontend, and architecture synthesis
- **/spec-lite** - Lightweight spec analysis optimized for free-tier users
- **/execution-plan** - Create comprehensive execution plan for project folder
- **/build** - Build full application from transcript file using parallel agents
- **/product-interview** - Conduct product interview to refine MVP concept

### Project Management & Planning
- **/todo** - Process transcript_todo.md and update todo.md with organized, prioritized tasks
- **/todo-cc** - Execute all CC-delegable tasks from todo.md in optimized parallel/sequential order
- **/todo-done** - Archive completed tasks from todo.md to dated Archive section
- **/feature-driven-development** - Generate feature list and execution plan with agent approval
- **/plan-mode** - Interactive AI-powered planning mode for complex tasks
- **/plan-lite** - Lightweight planning workflow optimized for free-tier users
- **/plan_review** - Have multiple specialized agents review a plan in parallel

### Development & Execution
- **/execute** - Execute the plan in todo.md using parallel subagents with coordination
- **/resolve_todo_parallel** - Resolve all pending CLI todos using parallel processing
- **/resolve_parallel** - Resolve all TODO comments using parallel processing
- **/resolve_pr_parallel** - Resolve all PR comments using parallel processing

### Code & Documentation
- **/cost-estimate** - Estimate development cost of a codebase based on lines of code and complexity
- **/changelog** - Create engaging changelogs for recent merges to main branch
- **/release-docs** - Build and update the documentation site with current plugin components
- **/deploy-docs** - Validate and prepare documentation for GitHub Pages deployment

### Content & Analysis
- **/book** - Process book photos to extract underlined/highlighted quotes into a markdown file
- **/yt-transcript** - Clean up YouTube transcript by removing timestamps and organizing into cohesive sentences
- **/cc-research** - Fetch and analyze r/ClaudeCode discussions to extract actionable techniques
- **/ccprompt** - Extract user prompts from conversation and save to claude_prompts.md
- **/conversation-insights** - Extract patterns, themes, and insights across multiple conversation transcripts

### CRM & Business
- **/crm-new** - Create a new CRM lead file from the lead template
- **/crm-next** - Suggest the next best action for a specific CRM lead
- **/crm-report** - Generate a comprehensive CRM pipeline report from all leads
- **/diligence-agent** - Run full contract diligence: assess contracts, spot-check results, upload to Monday.com

### Specialized Tools
- **/granola-sync** - Sync new Granola transcripts to /brain via automated Raycast extraction
- **/reproduce-bug** - Reproduce and investigate a bug using logs and console inspection
- **/report-bug** - Report a bug in the compounding-engineering plugin
- **/heal-skill** - Heal skill documentation by applying corrections discovered during execution
- **/create-agent-skill** - Create or edit Claude Code skills with expert guidance
- **/generate_command** - Create a new custom slash command following conventions and best practices
- **/prompt-help** - Expand a brief prompt to full specifications
- **/triage** - Triage and categorize findings for the CLI todo system

### Utilities
- **/pace** - Calculate percentage progress through weekly Claude Code usage period
- **/prime** - Load coding best practices - avoid over-engineering, read before editing
- **/skip-permissions** - Allow all tool use without approval prompts

---

## Skills

Skills are specialized tools invoked with `/skill-name` and provide focused capabilities.

### **cc-research**
**Purpose:** Fetch and analyze r/ClaudeCode discussions to extract actionable techniques and insights
**Usefulness:**
- Research latest Claude Code community techniques
- Find solutions to common problems others have solved
- Discover new tools and patterns used by community
**Example:** `/cc-research latest prompt engineering techniques`

### **conversation-insights**
**Purpose:** Extract patterns, themes, and insights across multiple conversation transcripts
**Usefulness:**
- Analyze what people ask about
- Identify recurring business ideas
- Find common themes in voice notes
- Synthesize insights from meetings
**Example:** `/conversation-insights business patterns from meeting transcripts`

### **email-writer**
**Purpose:** Draft professional emails matching a warm, direct, action-oriented voice
**Usefulness:**
- Write business communications
- Schedule meetings
- Draft proposals
- Write follow-ups with correct tone
**Example:** `/email-writer draft client onboarding email`

### **frontend-design**
**Purpose:** Create distinctive, production-grade frontend interfaces with high design quality
**Usefulness:**
- Build web components from scratch
- Create landing pages
- Design application dashboards
- Generate polished, modern UIs
**Example:** `/frontend-design create dashboard landing page`

### **frontend-imitate**
**Purpose:** Create frontend designs by imitating reference websites
**Usefulness:**
- Replicate successful design patterns
- Match competitor designs
- Learn from well-designed sites
- Maintain design consistency
**Example:** `/frontend-imitate https://stripe.com`

### **frontend-inspiration**
**Purpose:** Create frontend designs by gathering inspiration from reference websites
**Usefulness:**
- Draw design concepts from reference materials
- Find design patterns for specific problems
- Get inspiration from industry leaders
- Discover trending design approaches
**Example:** `/frontend-inspiration SaaS pricing pages`

### **gemini**
**Purpose:** Send prompts and tasks to Google Gemini using API key
**Usefulness:**
- Extended thinking mode for complex problems
- Multimodal analysis (images, text)
- Specialized tasks requiring Gemini capabilities
- Alternative AI perspective
**Example:** `/gemini analyze this image with extended thinking`

### **monday**
**Purpose:** Integrate with Monday.com API to create and update items on boards
**Usefulness:**
- Write metrics to Monday.com workspace
- Create and update tasks automatically
- Sync data from Claude to Monday
- Automate board updates
**Example:** `/monday create task on My Projects board`

---

## Agents

Agents are specialized AI personas that can be delegated work. They're invoked through the Task tool and coordinate large-scale development efforts.

### Business & Product Agents

#### **product-manager**
**Role:** Principal product manager for strategy, user experience, and feature prioritization
**Specialization:**
- Product strategy and vision
- User experience design
- Feature prioritization and roadmapping
- Requirements gathering
**Delegate When:** You need product vision, strategy analysis, or UX decisions
**Expertise Level:** Principal-level

#### **product-interviewer**
**Role:** Expert product interviewer who refines product concepts through strategic questioning
**Specialization:**
- Problem discovery
- Requirement clarification
- MVP definition
- User flow exploration
**Delegate When:** You want to deeply explore and refine product ideas
**Expertise Level:** Expert

#### **orchestrator**
**Role:** Technical program manager that orchestrates collaboration between backend and frontend
**Specialization:**
- Multi-team coordination
- Technical integration planning
- Resource allocation
- Dependency management
**Delegate When:** You need coordination between frontend and backend teams
**Expertise Level:** Principal-level

#### **program-manager**
**Role:** Senior program manager for project planning, stakeholder alignment, and blocker removal
**Specialization:**
- Project planning and scheduling
- Stakeholder management
- Blocker identification and resolution
- Risk management
**Delegate When:** You have large projects with multiple stakeholders
**Expertise Level:** Senior

#### **project-manager**
**Role:** Project manager for task delegation and developer agent coordination
**Specialization:**
- Day-to-day task management
- Developer coordination
- Team communication
- Progress tracking
**Delegate When:** You need ongoing task management and team coordination
**Expertise Level:** Senior

### Engineering Agents

#### **architect**
**Role:** Principal software architect for system design, technical strategy, and architectural patterns
**Specialization:**
- System design and architecture
- Design patterns
- Technical strategy
- Technology selection
**Delegate When:** Making major architectural decisions
**Expertise Level:** Principal-level

#### **frontend-engineer**
**Role:** Principal front-end engineer for modern web technologies and client-side architecture
**Specialization:**
- React and TypeScript
- Component design and architecture
- UX implementation
- Frontend performance optimization
**Delegate When:** Building UI/UX or designing frontend architecture
**Expertise Level:** Principal-level

#### **backend-engineer**
**Role:** Principal back-end engineer for server-side architecture and distributed systems
**Specialization:**
- API design and implementation
- Database design and optimization
- Scalability and performance
- System reliability
**Delegate When:** Building APIs, databases, or backend systems
**Expertise Level:** Principal-level

### Specialized Agents

#### **agent-cmo**
**Role:** Chief Marketing Officer in a Box
**Specialization:**
- Marketing strategy
- Brand positioning
- Go-to-market planning
- Marketing messaging
**Delegate When:** You need marketing strategy or positioning
**Expertise Level:** Chief-level

#### **call-analyzer**
**Role:** Conversational Pattern & Communication Analyzer
**Specialization:**
- Communication pattern analysis
- Conversation dynamics
- Pattern recognition
- Insight extraction
**Delegate When:** Analyzing communication patterns or call transcripts
**Expertise Level:** Specialist

---

## Quick Reference

### How to Use Commands
```bash
/command-name [arguments]
```
Examples:
- `/plan` - Start product planning
- `/build` - Build from transcript
- `/execute` - Run execution plan

### How to Use Skills
```bash
/skill-name [arguments]
```
Examples:
- `/cc-research prompt engineering`
- `/email-writer draft proposal`
- `/frontend-design landing page`

### How to Delegate to Agents
Agents are invoked through the Task tool in Claude Code:
```
Use Task tool with:
- subagent_type: 'product-manager' (or other agent)
- prompt: Your delegation instructions
```

---

## Project Workflow

1. **Start with Planning**
   - Use `/plan` or `/spec` to define requirements
   - Edit `.docs/transcript.md` with vision and requirements

2. **Create Execution Plan**
   - Use `/execution-plan` for detailed steps
   - Or `/build` to analyze and create plan automatically

3. **Execute with Agents**
   - Use `/execute` to run your plan
   - Agents automatically reference this claude.md
   - Use `/resolve_todo_parallel` for parallel execution

4. **Track Progress**
   - Use `/todo` to organize tasks
   - Use `/todo-done` to archive completed work

5. **Deliver & Document**
   - Use `/changelog` for release notes
   - Use `/deploy-docs` for documentation

---

## File Organization Tips

- **.docs/transcript.md** - Your project's single source of truth
- **.docs/prd.md** - Auto-generated by `/plan`
- **.docs/ui.md** - Auto-generated by `/build`
- **.docs/backend.md** - Auto-generated by `/build`
- **.docs/todo.md** - Your execution plan
- **claude.md** - This file; reference for all resources

## Tips for Success

1. **Use the Right Command** - Check the planning section for the right starting command
2. **Delegate Effectively** - Read agent descriptions to pick the right specialist
3. **Document Everything** - Keep .docs/transcript.md updated
4. **Iterate Quickly** - Use `/resolve_todo_parallel` to execute in parallel
5. **Reference Skills** - Use skills for specialized tasks like email writing or design

---

Generated by `/new-project` command - Update this file as your project evolves!
