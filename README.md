# Jerry AI Video2

A real text-to-video web app starter for Jerry ICT World.

## Current stack
- Plain HTML/CSS/JavaScript frontend
- Vercel serverless API routes
- Runway Gen-4.5 text-to-video API
- Secret API key stored in Vercel Environment Variables

## Deploy from GitHub + Vercel
1. Create a public GitHub repository named `jerry-ai-video`.
2. Upload all files in this folder, keeping the `api` folder.
3. Import the repository into Vercel.
4. In Vercel: Project -> Settings -> Environment Variables.
5. Add `RUNWAYML_API_SECRET` with your Runway API key.
6. Redeploy.
7. Open the Vercel URL and test a prompt.

IMPORTANT: Never put your Runway API key inside `app.js`, `index.html`, or any public GitHub file.

The generated Runway output URL is temporary. A later version should download/save completed videos to permanent storage and add user accounts, credits, payments, and an admin dashboard.
