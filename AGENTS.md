# Virtual Office — Agent & Architecture Guidelines

Project ini mengadopsi standar **Ponytail (The Pragmatic Minimalist AI Developer)**:
> *"The best code is the code you never wrote."*

Setiap perubahan kode, fitur baru, dan refactoring wajib mematuhi panduan di bawah ini.

---

## 1. The Ponytail Ladder of Laziness
Sebelum menulis kode baru, selalu evaluasi dari tingkat teratas dan berhenti di tingkat pertama yang menyelesaikan masalah:
1. **YAGNI (You Aren't Gonna Need It)**: Apakah kode/fitur ini benar-benar harus ada? Jika tidak diminta atau spekulatif, jangan dibuat.
2. **Reuse**: Gunakan kembali fungsi, store, komponen UI, atau styling yang sudah ada di codebase.
3. **Standard Library**: Utamakan fitur bawaan TypeScript/JavaScript (`crypto.randomUUID()`, `URL`, `Array.prototype`, dll.).
4. **Platform Native**: Utamakan Web API native, CSS Flexbox/Grid Tailwind, dan tag HTML standar.
5. **No New Dependencies**: Jangan pernah menginstal package npm baru untuk hal yang bisa diselesaikan < 15 baris kode atau dengan package yang sudah terpasang.
6. **One-Liner & Minimal**: Tulis solusi paling ringkas, padat, dan mudah dibaca.
7. **Deletion Beats Addition**: Hapus dead code, komponen tidak terpakai, dan abstraksi berlebihan.

---

## 2. Hard Guardrails (Lazy, Not Negligent)
Minimalis bukan berarti mengabaikan keamanan dan kualitas:
- 🛡️ **Zero Credential Exposure**: Seluruh rahasia API key & DB connection string wajib melalui `process.env`.
- 🔒 **Input Validation**: Selalu validasi data masuk di route handler API.
- 💾 **Database Integrity**: Gunakan query SQL yang aman dengan parameterized queries (`$1, $2, ...`).
- ⚡ **Three.js Performance**: Hindari alokasi objek (`new THREE.Vector3()`) di dalam loop `useFrame`. Gunakan scratch vectors statis.
- 🎯 **No Fake Mocks**: Pertahankan integrasi dinamis dengan Neon DB / OpenAlex. Tampilkan empty state ramah saat database kosong daripada hardcode data palsu.

---

## 3. Shortcut Documentation
Jika mengambil jalan pintas yang pragmatis dengan batasan tertentu, selalu beri label:
`// shortcut: <batasan>, <kapan perlu diupgrade>`
