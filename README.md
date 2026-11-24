# ResearchVerse AI — 3D AI Virtual Research Office

ResearchVerse AI adalah platform simulasi kantor riset virtual 3D interaktif yang digerakkan oleh **Multi-Agent AI** terspesialisasi untuk membantu penelitian akademik (skripsi, tesis, makalah ilmiah, literature review, analisis data, dan manajemen sitasi).

Pengguna bertindak sebagai **Director (Pimpinan Riset)**, mengawasi para karyawan AI yang bekerja di meja dan ruangan masing-masing dalam simulasi kantor 3D berbasis **Three.js**.

---

## 🏛️ Struktur Organisasi AI Agents (8 Karyawan)

1. **Project Manager (Head of Research Operations)**: Menerima instruksi Director, merancang rencana proyek, mendelegasikan tugas ke agent, memantau dependensi.
2. **Researcher (Literature Explorer)**: Menggali publikasi dan metadata akademik dari Crossref, OpenAlex, dan Semantic Scholar.
3. **Literature Analyst (Gap & Theory Specialist)**: Membedah penelitian terdahulu, memetakan matriks komparasi, dan menemukan research gap.
4. **Academic Writer (Drafting Specialist)**: Menyusun outline, menulis bab dan draf karya ilmiah dengan struktur akademik yang rapi.
5. **Data Analyst (Statistics & Visualization)**: Mengolah dataset CSV/Excel, uji statistik, dan visualisasi temuan.
6. **Citation Specialist (Reference Formatter)**: Memformat dan memvalidasi sitasi (APA 7th, IEEE, Harvard, dsb.) serta memeriksa DOI resmi.
7. **Academic Editor (Grammar & Flow)**: Mengedit tata bahasa ilmiah, keterbacaan, dan konsistensi peristilahan.
8. **Quality Reviewer (Academic Integrity & Audit)**: Memeriksa klaim tanpa referensi, integritas metodologi, dan verifikasi akhir.

---

## 🛠️ Tech Stack

* **Ecosystem**: Fullstack Next.js (TypeScript) + Serverless API Routes (Dirancang untuk Vercel & Neon DB)
* **3D Visual Engine**: Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
* **State & Styling**: Tailwind CSS, Zustand, Lucide React
* **AI & LLM Engines**: Groq Cloud (`llama-3.3-70b-versatile`) & Google Gemini
* **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
* **Academic Integrations**: Crossref API, OpenAlex API

---

## ⚡ Panduan Deploy ke Vercel (Online & Mobile Ready)

Proyek ini telah dimigrasikan ke arsitektur fullstack JavaScript/TypeScript Next.js, siap dideploy langsung ke **Vercel** agar dapat diakses dari browser PC maupun handphone (HP):

1. **Import Repository ke Vercel**:
   - Masuk ke [vercel.com](https://vercel.com) dan klik **"Add New Project"**.
   - Pilih repository GitHub: `virtual-office`.
   - Pada bagian **Root Directory**, klik **Edit** dan pilih folder: `frontend`.

2. **Environment Variables di Vercel**:
   Tambahkan variabel lingkungan berikut pada menu *Environment Variables* di Vercel:
   - `DATABASE_URL`: Connection string PostgreSQL dari Neon DB (contoh: `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`)
   - `GROQ_API_KEY`: API Key dari [console.groq.com](https://console.groq.com)
   - `GEMINI_API_KEY`: API Key dari [aistudio.google.com](https://aistudio.google.com)

3. **Klik Deploy**:
   - Vercel akan otomatis meng-compile dan website kantor 3D interaktif siap diakses online!

---

## 📱 Kontrol Interaktif & Navigasi Mobile
- **Desktop (Mouse)**:
  - Klik kiri + geser: Putar sudut pandang (Orbit).
  - Klik kanan / Dua jari trackpad: Geser denah kantor (Pan).
  - Scroll mouse: Zoom in & Zoom out leluasa hingga denah penuh.
- **Handphone / Tablet (Touchscreen)**:
  - 1 Jari: Putar sudut pandang 3D.
  - 2 Jari geser: Geser denah kantor ke segala arah.
  - Cubit (Pinch): Zoom in & Zoom out hingga kecil untuk melihat seluruh kantor.

---

## 🚀 Panduan Menjalankan Lokal

```bash
cd frontend
npm install
npm run dev
```
Buka browser di `http://localhost:3000` untuk berinteraksi langsung dengan AI Agent di kantor 3D!
