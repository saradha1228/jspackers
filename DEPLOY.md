# How to Deploy — JS Packers Website

## Option 1: Netlify Drop (Easiest — No account needed initially)

1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `Js_Packers` folder onto that page
3. Your site will be live in ~30 seconds with a URL like `https://random-name.netlify.app`
4. (Optional) Create a free account to get a custom subdomain like `jspackers.netlify.app`

## Option 2: Netlify CLI

```bash
/usr/local/Cellar/node/24.10.0/bin/netlify login
/usr/local/Cellar/node/24.10.0/bin/netlify deploy --dir /Users/saradha/Documents/Js_Packers --prod
```

## Option 3: GitHub Pages

1. Create a repo on github.com
2. Push this folder to main branch
3. Go to Settings → Pages → Deploy from branch → main / (root)
4. Site will be live at `https://yourusername.github.io/repo-name`

---

## How to Add Gallery Photos

1. Copy your photo into: `images/gallery/`  (e.g., `images/gallery/photo9.jpg`)
2. Open `js/gallery-data.js`
3. Add one line inside the array:
   ```js
   { src: "images/gallery/photo9.jpg", alt: "Description of photo" },
   ```
4. Save the file — that's it! The homepage shows the first 8, gallery page shows all.
