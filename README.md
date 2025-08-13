# Pietro Pugliesi - iOS Developer Portfolio

Modern, responsive portfolio website built with Next.js App Router, featuring bilingual support (Portuguese/English) and dark/light mode.

## 🚀 Features

- 🌍 **Bilingual support** (PT/EN) with toggle
- 🌙 **Dark/Light mode** with system preference detection
- 📱 **Fully responsive** design (mobile-first)
- ⚡ **Optimized for Cloudflare Pages** deployment
- 🎨 **Modern navy/slate** color scheme
- 📊 **JSON-based** content management
- 🔧 **Next.js App Router** with static export
- 🎯 **iOS Developer** focused design

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** React Icons (Feather)
- **Deployment:** Cloudflare Pages
- **Type:** Static Site Generation (SSG)

## 📁 Project Structure

```
pietro-portfolio/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── data/
│   └── resume.json
├── public/
│   └── (add your photo here)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Photo
Add your photo to the `public/` folder and update the image placeholder in `app/page.js`:

```jsx
// Replace the placeholder div with:
<Image
  src="/your-photo.jpg"
  alt="Pietro Pugliesi"
  width={320}
  height={320}
  className="rounded-2xl object-cover"
/>
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### 4. Customize Content
Edit `data/resume.json` to update:
- Personal information
- Work experience
- Projects
- Skills
- Contact details

## 🌐 Deployment to Cloudflare Pages

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/pietro-portfolio.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**
   - Click **Create application** > **Pages** > **Connect to Git**
   - Select your GitHub repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `out`
     - **Framework preset:** Next.js (Static HTML Export)

3. **Deploy:**
   - Click **Save and Deploy**
   - Your site will be available at `your-project.pages.dev`

### Method 2: Direct Upload

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the `out` folder** to Cloudflare Pages dashboard

### Adding Custom Domain

1. In Cloudflare Pages dashboard, go to **Custom domains**
2. Click **Set up a custom domain**
3. Add your domain (e.g., `pietropugliesi.dev`)
4. Follow DNS configuration instructions
5. SSL certificate will be generated automatically

## 🎨 Customization

### Colors
The design uses a navy/slate color scheme. To customize, edit `tailwind.config.js`:

```javascript
colors: {
  slate: {
    // Your custom colors here
  }
}
```

### Content
All content is managed through `data/resume.json`. The structure supports:
- Basic information
- Work experience with highlights and technologies
- Personal projects
- Skills categorization
- Social media profiles

### Styling
- **Global styles:** `app/globals.css`
- **Component styles:** Tailwind classes in `app/page.js`
- **Dark mode:** Automatic with `dark:` classes

## 📊 Performance Features

- **Static Site Generation** for fast loading
- **Image optimization** with Next.js Image component
- **Automatic code splitting**
- **CSS optimization** with Tailwind CSS
- **Smooth scrolling** navigation
- **Responsive design** for all devices

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server locally
npm start

# Linting
npm run lint
```

## 📝 Content Management

The `resume.json` file follows a structured format:

```json
{
  "pt": {
    "basics": { /* personal info */ },
    "work": [ /* work experience */ ],
    "projects": [ /* personal projects */ ],
    "skills": { /* categorized skills */ }
  },
  "en": { /* English version */ }
}
```

## 🌍 Bilingual Support

- Language toggle in header
- Persistent language preference (localStorage)
- Complete translation for all sections
- SEO-friendly with proper lang attributes

## 📱 Mobile Optimization

- **Mobile-first** responsive design
- **Touch-friendly** interactive elements
- **Optimized typography** for small screens
- **Collapsible navigation** on mobile

## 🚀 Performance Tips

1. **Optimize images** before adding to `public/`
2. **Keep JSON data** lean and relevant
3. **Use WebP format** for photos when possible
4. **Test on mobile devices** regularly

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Feel free to submit issues and pull requests to improve this template.

---

**Built with ❤️ for iOS Developers**