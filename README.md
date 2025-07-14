# SSM App - Aplicație Mobilă pentru Managementul SSM

## Descriere

SSM App este o aplicație mobilă dezvoltată pentru managementul Sănătății și Securității în Muncă (SSM). Aplicația permite gestionarea incidentelor, evaluărilor de risc, instruirilor și prezenței angajaților, oferind o soluție completă pentru departamentele SSM.

## Tehnologii

- React Native
- TypeScript
- Expo
- Firebase (Authentication, Firestore, Storage)
- React Navigation
- React Native Paper

## Structura proiectului

```
SSM_App/
├── src/
│   ├── assets/          # Imagini, fonturi și alte resurse
│   ├── components/      # Componente reutilizabile
│   ├── config/          # Configurări (Firebase, teme, constante)
│   ├── contexts/        # Context API pentru state management
│   ├── hooks/           # Custom hooks
│   ├── navigation/      # Configurare navigare
│   ├── screens/         # Ecranele aplicației
│   ├── services/        # Servicii pentru API și logică de business
│   ├── types/           # Definiții TypeScript
│   └── utils/           # Funcții utilitare
├── App.tsx              # Punctul de intrare al aplicației
└── index.js             # Fișier de inițializare
```

## Caracteristici

- **Autentificare**: Înregistrare, autentificare și recuperare parolă
- **Gestionare incidente**: Raportare, vizualizare și gestionare incidente
- **Evaluări de risc**: Creare și gestionare evaluări de risc
- **Instruiri**: Programare și urmărire instruiri SSM
- **Prezență**: Gestionare prezență la instruiri și activități
- **Notificări**: Sistem de notificări pentru evenimente importante
- **Profil utilizator**: Gestionare informații personale și preferințe

## Instalare

1. Clonează repository-ul:
   ```bash
   git clone https://github.com/viarom/ssm-app.git
   cd ssm-app
   ```

2. Instalează dependențele:
   ```bash
   npm install
   # sau
   yarn install
   ```

3. Configurează Firebase:
   - Creează un proiect în Firebase Console
   - Adaugă configurația în `src/config/firebase.ts`

4. Pornește aplicația:
   ```bash
   npm start
   # sau
   yarn start
   ```

## Rulare pe dispozitive

### Android
```bash
npm run android
# sau
yarn android
```

### iOS
```bash
npm run ios
# sau
yarn ios
```

## Dezvoltare

### Convenții de cod

- Folosim TypeScript pentru tipare statică
- Componente funcționale cu hooks
- Context API pentru state management
- Stilizare folosind React Native Paper și StyleSheet

### Contribuire

1. Fork repository-ul
2. Creează un branch pentru feature: `git checkout -b feature/numele-feature-ului`
3. Commit schimbările: `git commit -m 'Adaugă feature nou'`
4. Push la branch: `git push origin feature/numele-feature-ului`
5. Deschide un Pull Request

## Licență

Acest proiect este proprietatea VIAROM CONSTRUCT și este protejat de drepturi de autor.

## Contact

Pentru întrebări sau sugestii, vă rugăm să contactați echipa de dezvoltare la adresa de email: dev@viarom.ro 