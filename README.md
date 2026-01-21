# Liveblocks Workshop: Set up

This repo contains a demo chat application that allows you to use Liveblocks agents session through n8n, 
enabling you to build complex AI workflows. Feel free to extend it, and make it your own.

https://github.com/user-attachments/assets/c3f0618d-302b-48ff-a2a2-989134772cb4

## Explanation

### What is n8n?

n8n is a workflow interface that lets you connect together different applications and APIs, ideal 
for building multi-step AI agents. Working like a flowchart, each item is called a _node_ (not 
related to _Node.js_). We've created a set of Liveblocks nodes, that allow you to interact with
our APIs via n8n.

### Agent sessions

Agent sessions is a new Liveblocks feature we've been developing. Each session is a real-time
message store, which allows you to place in any data you like. When data is placed inside, it
will update immediately for all connected users.

This project has a chat setup that creates/fetches an agent session for you when a chat message
is sent, then triggers your n8n webhook. Within n8n we have a node that lets you add a new 
message, "Add Agent Message". In our app, we can see that the `useAgentSession` update hook
updates with the new message whenever this is called.

Additionally, _agent presence_ allows you to show the active status of an AI agent, for example
"Thinking...", or "Searching...". This project is set up to display a "Thinking..." message
when the AI is generating text, and this works using the "Update Presence" node.

### The whole flow

Here's how this n8n flow works. The file for the workflow is `n8n-chat-workflow.json` which you'll import into n8n later.

<img width="3386" height="2276" alt="CleanShot 2026-01-21 at 15 38 35@2x" src="https://github.com/user-attachments/assets/fd0e22f0-afe0-4bfc-84e3-e22fc2bdcc35" />

## Set up Node.js 

**A Node.js version between 22.16-24.X is required.**

- If you don't already have Node.js installed, make sure to [install v24 from the website](https://nodejs.org/en/download).
- If you already have Node.js installed, make sure to use 22.16-24.X. It's easy to [switch versions with nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#intro).

## Clone this repo

1. Clone, install, and run this repo.

```bash
git clone https://github.com/liveblocks/boilerplate-n8n-hackathon.git
npm install
npm run dev
```

2. Sign up to https://development.liveblocks.io, create a project in the dashboard, and copy your secret API key.

<img width="2100" height="1346" alt="image" src="https://github.com/user-attachments/assets/f3797c68-a8b4-4c73-b958-2370a32cd821" />

<img width="2100" height="1348" alt="image" src="https://github.com/user-attachments/assets/9e13e6c8-122e-417c-8bbc-b22d295f3ef4" />

3. Put your secret key in a `.env.local` file in the root of this project.

```dotenv
LIVEBLOCKS_SECRET_KEY=sk_...
```

## Set up n8n

1. Install n8n via terminal.

```bash
npm install -g n8n
```

2. Go to http://localhost:5678/ + sign up. If you don't see a sign up page, run `n8n user-management:reset`.
3. Stop n8n (cmd+c / ctrl+c).
4. Download and install the custom Liveblocks n8n nodes.

```bash
cd ~/.n8n
mkdir custom
cd custom
mkdir node_modules
cd node_modules
git clone https://github.com/liveblocks/n8n-nodes
cd n8n-nodes
npm install
npm run build
n8n start
```

5. Go back to n8n, click the [Credentials page](http://localhost:5678/home/credentials), and add credentials for “Liveblocks API”, pasting in your secret key from earlier.
        
<img width="2100" height="1352" alt="image" src="https://github.com/user-attachments/assets/94d67c3e-968c-44c8-9e3f-2eb806252f5e" />

<img width="2096" height="1342" alt="image" src="https://github.com/user-attachments/assets/befc8633-90cc-453a-8ba7-2b1aaf7c454d" />

<img width="2096" height="1344" alt="image" src="https://github.com/user-attachments/assets/dbcb5c85-649f-4eb1-88aa-a85bfcd1d64f" />

6. Create an "Open AI" credential in the same way—ask our team and we'll give you our OpenAI API key.

## Run the pre-built workflow

1. Download the `n8n-chat-workflow.json` file in this repo.
2. In n8n, go to the [Overview page](http://localhost:5678/home/workflows) and hit “Create Workflow” in the top-right
3. Open the menu at the top-right and import the `n8n-chat-workflow.json` file, found at the root of this project.

<img width="1028" height="848" alt="CleanShot 2026-01-21 at 14 10 51@2x" src="https://github.com/user-attachments/assets/99f87388-f610-43ac-b75b-b7b5ecf9b12f" />

4. Open the first node, copy the "Production URL", and "Publish" your app.

https://github.com/user-attachments/assets/4016d486-167a-4627-8b1e-a6ba7e50c137


5. Paste the Production URL into the `.env.local` file in the project.

```dotenv
N8N_WEBHOOK_URL=http://localhost:5678/webhook/...
```

6. You can now use your AI chat!

https://github.com/user-attachments/assets/065ad805-15e0-4f23-b2d4-dc3ed7e40f4e

7. Extend your app! Add more nodes, link up to various apps, for example:
 - Read events from your Google Calendar and answer questions.
 - Create new issues on Linear, and link to them.
 - Generate documents on Notion, and suggest further changes.

...and much more—happy hacking!

## Troubleshooting

- Make sure you have Node 22.16 or greater
- Make sure you use a Secret Key from https://development.liveblocks.io
- If n8n seems buggy, try creating a new workflow
- If you need to tunnel for Webhooks, use ngrok or 
`npx localtunnel --port 5678`

