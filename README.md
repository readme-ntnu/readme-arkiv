# readme-arkiv

Artikkel og utgavedatabase for studentmagasinet [readme](https://readme.abakus.no).

## Hvordan fungerer dette?

Dette er et Firebase-prosjekt. Utgavene med forside-bilde og PDF ligger i Firebase Storage, mens artiklene ligger i en Firestore-database. Klienten kan søke etter artikler i denne ved bruk av en Cloud Function ved navn `search`. Den functionen fungerer altså som en enkel backend-server. Klienten er laga med Create React App.

## Kom i gang

Aller først må du sørge for at du har Node.js v10 installert.

Deretter klon repoet og installer avhengigheter:

```
git clone git@github.com:readme-ntnu/readme-arkiv.git
cd readme-arkiv
npm install
cd functions
npm install
```

Så må du installere firebase-tools:

```
npm i -g firebase-tools
```

Det er alt! Nå trenger du bare å kjøre:
```
npm start
```
Dette vil starte opp Firebase-emulatorer for Hosting, Functions, Firestore, Storage og Auth, og laste inn testdata i de tre siste. Det starter også en bygg-watcher for frontend-en, som bygger frontend-en på nytt hver gang det skjer endringer. NB: Siden vi leverer siden via Hosting-emulatoren, og ikke en utviklingsserver, har vi ikke hot reload på siden, selv om alt kompileres automatisk. Du må altså refresh-e siden for å få inn endringene dine.

Selve applikasjonen kan nås på [localhost:3000](localhost:3000), mens emulatorene kan styres/justeres/inspiseres fra [localhost:4000](localhost:3000). Auth-emulatoren lastes inn med en testbruker som har e-post `andreas.h.haaversen@gmail.com` og passord `password`. Bruk denne om du vil se admin-sidene ([localhost:300/admin](localhost:3000/admin)).

## Deploy

For å sette dine endringer i produksjon, skal det ikke mer til enn å pushe eller merge de til master.

Om du vil gjøre det manuelt, gjør du som følger.

Først må du logge inn på Firebase i terminalen din om du ikke allerede har gjort det:

```
firebase login
```

Du må få noen til å gi deg tilgang til `readme-arkiv`-prosjektet i Firebase. For å sjekke om du har tilgang, kjør `firebase projects:list` i terminalen. `readme-arkiv` skal ligge der om du har tilgang.

Deretter kan du kjøre:

```
npm run deploy
```

Dette vil bygge klienten og deploye både den og functions.

## Bidrag

Om du ønsker å bidra, er du hjertelig velkommen til det. Prosjektet benytter seg av [git flow](https://danielkummer.github.io/git-flow-cheatsheet/index.html) som branching-modell. Det ønskes at man følger denne.
