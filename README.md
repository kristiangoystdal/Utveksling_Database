# Utvekslingsportalen

**Utvekslingsportalen** is a Vue 3 web application that helps NTNU students explore previous exchange experiences.  
It aggregates real data — universities, courses, countries, years, and specializations — and provides powerful filtering and search tools to help students plan their own exchange semester.

🔗 **Live website:** https://utvekslingsportalen.no

---

## ✨ Core Features

- **Browse historical exchanges** with full course lists and ECTS totals  
- **Advanced filtering** (country, university, study program, specialization, semester count, year)  
- **Locale-aware search** (searching “Italia”, “Italy”, or “Italien” all just work)  
- **Expandable rows** with detailed course tables and comments  
- **Favorites system** (Firebase Auth backed)  
- **Fully responsive design**  
- **Languages:** Norwegian 🇳🇴 and English 🇬🇧  

---

## 🧩 Tech Stack

- **Vue 3**
- **Vuetify 3**
- **Vite**
- **Vue Router**
- **Vue-i18n**
- **Firebase Realtime Database**
- **Firebase Authentication**
- **Firebase Hosting**

---

## 🔐 Local Development

This project **cannot** run locally without your own Firebase project and environment files.

Environment variables and API keys are intentionally **not included**.

The repository is public for:

- documentation  
- issue tracking  
- transparency  
- portfolio and open-source contributions  

---

## 📁 Project Structure

```
UTVEKSLING_DATABASE
├─ dist/                      # Production build output
├─ public/                    # Static assets
├─ src/
│  ├─ assets/
│  │  ├─ css/                 # Styling (buttons, tables, layout, navbar, etc.)
│  │  └─ images/
│  ├─ components/
│  │  ├─ admin/
│  │  ├─ common/
│  │  ├─ courses/
│  │  ├─ error/
│  │  ├─ exchanges/           # Main exchange pages & tables
│  │  ├─ home/
│  │  ├─ profile/
│  │  └─ windows/
│  ├─ data/                   # Country metadata, mapping JSON, etc.
│  ├─ js/                     # Firebase, router, store
│  ├─ languages/              # i18n (no/en)
│  ├─ mixins/                 # Shared logic utilities
│  ├─ plugins/                # Vuetify setup
│  └─ App.vue                 # Root component
```

---

## 🤝 Contributing

Contributions are welcome!

- Found a bug? → **Open an issue**
- Want to improve translations/UI/UX? → **Submit a PR**
- Missing country translations? → **Add them**

The project is actively maintained and community contributions are appreciated.

---

## 📜 License

MIT License — open for educational and portfolio use.
