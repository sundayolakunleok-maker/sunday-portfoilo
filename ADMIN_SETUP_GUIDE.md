# Sunday Okegbemi — Central Admin Control Centre & MIT 624 Platform Setup Guide

## 1. Overview
The Central Admin Control Centre allows you (**Sunday Olakunle Okegbemi**) to securely manage your **Professional Portfolio Website** and **MIT 624 Academic Platform** from a unified, secure dashboard.

---

## 2. Initial Administrator Credentials

For first-time setup, use these temporary credentials:

- **Login URL**: `/login` (accessible via the **Admin** shield icon in the top header or footer)
- **Initial Username**: `Olakunle`
- **Initial Password**: `Sunday@1234`
- **Emergency Recovery PIN**: `703567`

### Mandatory First-Time Password Change
When you log in with `Sunday@1234` for the first time, the security engine will automatically display a **First-Time Security Requirement Modal**. You **must** create your own private, strong password (minimum 8 characters) before entering the dashboard.

Once updated, your new password will be hashed using **Web Crypto PBKDF2 (SHA-256 with 100,000 iterations + cryptographic salt)** and stored securely in Firestore.

---

## 3. Dashboard Capabilities

### A. Navigation & Modules (17 Management Views)
1. **Dashboard Overview**: 10 live KPI metrics (Total resources, assignments, tasks, documents, videos, live published content, drafts, and unread inquiries).
2. **Portfolio Management**: Manage portfolio projects, client case studies, and career materials.
3. **MIT 624 Management**: Manage academic deliverables across Discussions 1, 3, 5, 7 and Tasks 1, 2, 3, 4.
4. **Upload New Content**: Upload PDF, Word, Excel, PowerPoint, CSV, ZIP, Images, and MP4 videos.
5. **Manage Documents**: Filter and preview uploaded documents with download permissions.
6. **Assignments**: Manage course assignment records and solutions.
7. **Tasks and Projects**: Oversee implementation code and repository links.
8. **Videos**: YouTube integration and video tutorial management.
9. **Images and Media**: Screenshots and technical diagrams.
10. **Course Materials**: Student notes and lecture slides.
11. **Categories**: Organize deliverables by subject.
12. **YouTube Channel**: Direct connection with the **Olakunle Data** channel.
13. **Website Content**: Update biography, headline, contact phone, and location in real-time.
14. **Contact Messages**: Live inbox for incoming client inquiries submitted via the website contact form.
15. **Account Settings**: Change username and password anytime (verifies current password).
16. **Security Settings**: Review encryption standard, lockout threshold, and session validity.
17. **Logout**: Destroys session token and returns to public homepage.

---

## 4. How to Upload and Publish Content

1. Log in at `/login`.
2. Click the **+ Upload New Content** button (or **Upload Resource** on the Overview tab).
3. Fill in:
   - **Title**: (e.g. *MIT 624 Discussion 1 Presentation Slide*)
   - **Target Platform**: Choose *MIT 624 Academic* or *Professional Portfolio*.
   - **Course Module**: (e.g. *Discussion 1*, *Task 1*, *Task 2*, etc.)
   - **Content Type**: Document, Assignment, Task, Video, Image, or Code.
   - **File Attachment**: Select a file from your computer (PDF, Word, Excel, PNG, MP4, etc.) or provide a cloud link.
   - **Visibility Status**: Set to **Published** for it to immediately appear on the public website, or **Draft** to keep it private.
   - **Download Permission**: Check "Allow Visitors to Download File" if visitors should be able to download the original document.
4. Click **Publish Resource**.
5. The resource is immediately saved in Firestore and visible on the website without needing to redeploy code!

---

## 5. Contact & Social Profiles Configured

- **Email**: `sundayolakunleok@gmail.com`
- **WhatsApp**: `+2347035672890` (Direct link: `https://wa.me/2347035672890`)
- **LinkedIn**: `https://www.linkedin.com/in/okegbemi-sunday-578b0975`
- **YouTube Channel**: `https://www.youtube.com/@OLAKUNLEokegbemi` (Olakunle Data)

---

## 6. Netlify Deployment Notes

- Single Page Application routing is guaranteed by `/public/_redirects` (`/*  /index.html  200`).
- No backend servers required; Firestore acts as your persistent cloud database.
