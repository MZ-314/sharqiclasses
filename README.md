# Sharqi Classes Website

**sharqiclasses.in** — Built with HTML/CSS/JS. Deploy to Vercel in minutes.

---

## 🚀 Deploy to Vercel

### Option A — Drag & Drop (Easiest)
1. Go to https://vercel.com/new
2. Drag this entire folder onto the page
3. Done — you'll get a `*.vercel.app` URL instantly

### Option B — GitHub
1. Push folder to a GitHub repo
2. Go to vercel.com → New Project → Import repo
3. Click Deploy (no config needed)

### Add Custom Domain
1. Vercel Project → Settings → Domains
2. Add `sharqiclasses.in` and `www.sharqiclasses.in`
3. Follow Vercel's DNS instructions at your domain registrar

---

## ✏️ Things to Update Before Going Live

### 1. Logo (both places in index.html)
Replace `src="/mnt/user-data/uploads/..."` with your Cloudinary URL:
```html
<img src="https://res.cloudinary.com/YOUR_CLOUD/image/upload/.../logo.png" alt="Sharqi Classes" class="logo-img" />
```

### 2. Slideshow Images (in .hero-slides section)
Replace the 4 Unsplash URLs with your own Cloudinary image URLs:
```html
<div class="hero-slide active" style="background-image: url('YOUR_CLOUDINARY_URL')"></div>
```

### 3. Teacher Photo
Replace the `.about-photo-placeholder` div with a real image:
```html
<img src="YOUR_CLOUDINARY_PHOTO_URL" alt="Your Name" class="about-real-photo" />
```
Add this CSS: `.about-real-photo { width:100%; aspect-ratio:3/4; object-fit:cover; border-radius: 24px 4px 24px 4px; }`

### 4. Your Name, Bio, Qualification
Search for `[Your Name]`, `[Your Qualification]`, `[Your Subjects]` and replace.

### 5. Phone Number
Replace all `+91XXXXXXXXXX` / `XXXXX XXXXX` with your actual number.

### 6. Address
Replace `[Your Address]` with your real address.

### 7. Google Form Links (CRITICAL)
Replace these placeholder hrefs:
- `https://forms.gle/REPLACE_BATCH1_FORM` → Batch 1 Google Form link
- `https://forms.gle/REPLACE_BATCH2_FORM` → Batch 2 Google Form link
- `https://forms.gle/REPLACE_OO_FORM` → One-on-One Google Form link

### 8. WhatsApp Link
Replace `91XXXXXXXXXX` with your actual number (country code + number, no spaces):
```
https://wa.me/919876543210
```

### 9. Social Media Links
Search for `href="#"` in the social sections and replace with real URLs.

---

## 🔴 Updating Batch Status (Do This Yourself Anytime)

In `index.html`, find these elements and change the class:

**Batch 1 or 2 Status:**
```html
<!-- Seats available (green) -->
<div class="batch-status available" id="batch1-status">

<!-- Seats full (red) -->
<div class="batch-status full" id="batch1-status">
```

**One-on-One Status:**
```html
<!-- Can negotiate (amber) -->
<div class="batch-status negotiable" id="oo-status">

<!-- Not taking new students (purple) -->
<div class="batch-status unavailable" id="oo-status">
```

---

## 📁 File Structure
```
sharqiclasses/
├── index.html       ← Everything here
├── css/style.css    ← All styles
├── js/main.js       ← Slideshow, nav, interactions
├── vercel.json      ← Vercel config
└── README.md        ← This file
```
