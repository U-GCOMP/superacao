# Jorge (professor)
- Documentation: https://drive.google.com/drive/folders/13i6HHmDM3tgAwozobs6Q-L0VLLXL3dwW?usp=sharing
- Prototype: https://www.figma.com/team_invite/redeem/1HKeZ7PpqehU7E86RkGiae?t=cIl7NCsH8ZGLDxCO-21
- Activity tracking: https://superacao-unesp.atlassian.net/jira/software/projects/SCRUM/boards/1

# How to run
1. Clone locally the main branch;
2. Have docker desktop, pnpm and node installed on your machine;
3. Create inside apps/backend a .env file and copy all the contents from .env.example inside this new file;
4. Run on main directory:
```bash
pnpm install
```
5. Change directory to apps/backend and run all the appropriate database related scripts:
```bash
docker compose up -d
```
```bash
pnpm typeorm migration:run
```
```bash
pnpm run seed
```
6. Change directory back into main directory and run:
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
