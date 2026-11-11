# Professional Portfolio & MIT 624 Academic Setup Guide

This portfolio for **Sunday Okegbemi** is a **High-Performance Static React Website** featuring your **Industry Analytics Portfolio** and dedicated **MIT 624 – AI-Powered Software Development Course Page**.

---

## 1. How to Update Your MIT 624 Course Deliverables
All course activities, videos, GitHub repositories, screenshots, and documents are centrally organized in `src/courseData.ts`:

### A. Adding Your Discussion 1 YouTube Video:
1. Open `src/courseData.ts`.
2. Find `youtubeUrl` in the `discussion-1` entry:
   ```ts
   youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
   ```
3. When provided, the video player automatically embeds and plays directly on your MIT 624 page!

### B. Updating Tasks 1–4 and Discussions 3, 5, 7:
As assignments and discussion prompts are released throughout the semester:
1. Open `src/courseData.ts`.
2. Update the `instructions`, `githubUrl`, `documentUrl`, or `status` (`'Not Started' | 'In Progress' | 'Completed'`).
3. To add project screenshots, add image paths or URLs into the `screenshots` array:
   ```ts
   screenshots: [
     { caption: "Enterprise Architecture Diagram", url: "/screenshots/task1-arch.png" }
   ]
   ```

---

## 2. Updating Profile Information & Industry Projects
* Open `src/data.ts`.
* Here you can edit your title, bio, Medium blog links, and social URLs.
* Your professional photo is saved as `/sunday-okegbemi.jpg` in the `public/` directory.

---

## 3. Launching Online on Netlify
1. In AI Studio, click **Settings** (bottom left) > **Export to GitHub**.
2. Push or merge changes to your GitHub repository (e.g., `sunday-okegbemi-portfolio`).
3. Log in to [Netlify.com](https://netlify.com) using your GitHub account.
4. If your site `https://okegbemisunday.netlify.app` is already connected, Netlify will **automatically rebuild and publish** the new MIT 624 page within seconds.
5. `public/_redirects` is already included so direct URLs like `https://okegbemisunday.netlify.app/mit-624` work seamlessly on page refresh!

---

## 4. Running Locally on Your PC
1. **Install Node.js** from [nodejs.org](https://nodejs.org).
2. Open terminal in the project folder and run:
   ```bash
   npm install
   npm run build
   ```
3. Run the Python server:
   ```bash
   python serve.py
   ```
4. Open `http://localhost:8000` or `http://localhost:8000/mit-624` in your browser.
