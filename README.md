# Jorge (professor)
- Documentation: https://drive.google.com/drive/folders/13i6HHmDM3tgAwozobs6Q-L0VLLXL3dwW?usp=sharing
- Prototype: https://www.figma.com/files/team/1304939853512937627/project/128429033?fuid=1291144248627052129
- Activity tracking: https://superacao-unesp.atlassian.net/jira/software/projects/SCRUM/boards/1

# How to run
1. Clone locally the main branch;
2. Have docker desktop installed on your machine;
3. Change directory to apps/backend and run all the database related scripts;
4. Change directory back into main directory and run:
```bash
pnpm run dev
```
 or just:
```bash
pnpm dev
```

# Recommendations

- Commit with meaningful names
  - Prefixes: feat:, fix:, refact:, chore:
  - Message: Describe shortly what you did
  - Example:
    - feat: new button component
    - fix: login form breaking in mobile
    - refact: enhance useWindowSize hook performance
    - chore: update README.md frontend documentation

- Create only when necessary
  - Use already created generic components (add needed behaviours if it fits the component's responsability)
  - Create reusable code

- Be clear
  - Create code with meaningful names
  - Describe decisions in PR
