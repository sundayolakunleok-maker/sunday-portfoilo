# Deployment & Local Setup Guide: Sunday Okegbemi Portfolio

## Phase 0: The Easiest Way (No Computer Setup Needed)
If you don't want to install anything on your computer, the best way is to let **GitHub and Netlify** handle everything for you. They will build the website in the cloud for free.

1. **Export to GitHub**: Use the "Export to GitHub" button in AI Studio Settings.
2. **Connect to Netlify**: Sign into Netlify and select that repository. It will go live automatically!

---

## Phase 1: Running Locally (Requires Node.js)
Because this is a modern React application, it needs to be "Built" into a website before it can run.

1. **Install Node.js**: You **MUST** install [Node.js](https://nodejs.org) (the LTS version). This is the "engine" that runs modern web tools like React.
2. **Open your project folder** in your Terminal or Command Prompt.
3. **Run these commands**:
   ```bash
   npm install
   npm run build
   ```
4. **Now use Python**: Only after you run the build can you use your python script:
   ```bash
   python serve.py
   ```
   *Your website is now viewable at http://localhost:8000*

---

## Phase 1: GitHub (Hosting your code)
1. **Create Account**: Sign up at [github.com](https://github.com).
2. **Create Repository**: Name it `sunday-portfolio`.
3. **Export**: In AI Studio, go to Settings > Export to GitHub.

---

## Phase 2: Netlify (Live Website)
1. **Sign Up**: Use GitHub to join Netlify.
2. **Deploy**: Import your `sunday-portfolio` repo.
3. **Settings**: Build command `npm run build`, Publish directory `dist`.
4. **LIVE**: Your site is now live at `your-name.netlify.app`!

## Phase 3: Firebase Configuration (The Backend)

To allow the "Upload Project" feature to work on your live site:
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Under **Project Settings**, go to the **Web App** section.
3. Make sure the domain `sunday-okegbemi.netlify.app` is added to the **Authentication > Settings > Authorized domains** list.
4. Now you can log in to your live site and add projects anytime!

---
*Developed with Google AI Studio*
