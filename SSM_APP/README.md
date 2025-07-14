# SSM App - Aplicație Mobilă pentru Securitate și Sănătate în Muncă

## Descriere

SSM App este o aplicație mobilă dezvoltată pentru gestionarea activităților de Securitate și Sănătate în Muncă (SSM) în domeniul construcțiilor. Aplicația permite raportarea incidentelor, evaluarea riscurilor, gestionarea instruirilor și monitorizarea prezenței angajaților.

## Tehnologii utilizate

- **Frontend**: React Native cu Expo
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API
- **UI**: React Native Paper

## Funcționalități principale

- Autentificare și înregistrare utilizatori
- Raportare incidente cu posibilitatea de a adăuga fotografii și locație GPS
- Evaluări de risc prin checklist-uri dinamice
- Instruiri și testări online
- Monitorizare prezență cu geolocalizare
- Notificări pentru instruiri expirate, avize expirate și sarcini noi

## Instalare

### Cerințe preliminare

- Node.js (v14 sau mai recent)
- npm sau yarn
- Expo CLI

### Pași de instalare

1. Clonează repository-ul:
   ```
   git clone https://github.com/username/ssm-app.git
   cd ssm-app
   ```

2. Instalează dependențele:
   ```
   npm install
   ```
   sau
   ```
   yarn install
   ```

3. Configurează Firebase:
   - Creează un proiect în Firebase Console
   - Activează Authentication, Firestore și Storage
   - Copiază credențialele în `src/config/firebase.ts`

4. Pornește aplicația:
   ```
   npm start
   ```
   sau
   ```
   yarn start
   ```

## Structura proiectului

```
SSM_APP/
├── src/
│   ├── assets/           # Imagini, fonturi, etc.
│   ├── components/       # Componente reutilizabile
│   ├── config/           # Configurări (Firebase, teme, constante)
│   ├── contexts/         # Context API pentru state management
│   ├── hooks/            # Custom hooks
│   ├── navigation/       # Configurare navigare
│   ├── screens/          # Ecranele aplicației
│   ├── services/         # Servicii pentru API și Firebase
│   ├── types/            # Tipuri TypeScript
│   └── utils/            # Funcții utilitare
├── App.tsx               # Punctul de intrare în aplicație
├── app.json              # Configurare Expo
└── package.json          # Dependențe și scripturi
```

## Planuri de viitor

- Migrare la un backend dedicat cu FastAPI și PostgreSQL
- Integrare cu Microsoft Dynamics 365 Business Central
- Dashboard web pentru management
- Rapoarte avansate și analize

## Contribuții

Contribuțiile sunt binevenite! Pentru sugestii, probleme sau contribuții, vă rugăm să deschideți un issue sau un pull request.

## Licență

Acest proiect este licențiat sub [Licența MIT](LICENSE). 