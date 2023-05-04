<h1 align="center">Paper</h1>

💨 Simple CRUD API with UI for people profiles

Build on [NextJS](https://nextjs.org/ "NextJS"), **TS**, [Prisma](https://www.prisma.io/ "Prisma"), [Mantine](https://mantine.dev/ "Mantine"), [formidable](https://github.com/node-formidable/formidable "formidable")

## Pull
1.  Install all dependencies
```bash
npm i
```
2.  Write in env file (rename .env.example => .env)
3. Migrate prisma migrations
```bash
npx prisma migrate dev
# or if you want to migrate on production
npx prisma migrate deploy
```
4. Go on
```bash
npm run dev
```
## License
[License](https://github.com/AnemonOFF/paper/blob/master/LICENSE)
