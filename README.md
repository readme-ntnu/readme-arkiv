# readme-arkiv

Søkemotor for artikler i studentmagasinet [readme](https://readme.abakus.no).

## Hvordan fungerer dette?

Dette er et Firebase-prosjekt. Artiklene ligger i en Firestore-database, og klienten kan søke etter artikler i denne ved bruk av en Cloud Function ved navn `search`. Den functionen fungerer altså som en enkel backend-server. Klienten er laga med Create React App.

## Kom i gang

Aller først må du sørge for at du har Node.js v10 installert.

Deretter klon repoet og installer avhengigheter:

```
git clone git@github.com:readme-ntnu/readme-arkiv.git
cd readme-arkiv
npm install
```

Så må du logge inn på Firebase i terminalen din:

```
npm i -g firebase-tools
firebase login
```

Du må få noen til å gi deg tilgang til `readme-arkiv`-prosjektet i Firebase. For å sjekke om du har tilgang, kjør `firebase projects:list` i terminalen. `readme-arkiv` skal ligge der om du har tilgang.

For å kunne snakke med Firestore-databasen lokalt, må du ha en _Service Account Key_ lokalt. Gå til https://console.cloud.google.com/iam-admin/serviceaccounts og følg disse stegene:
* Velg `readme-arkiv` som prosjekt.
* Finn raden med Name "App Engine default service account"
* Trykk på menyen til høyre på denne raden, og velg Create key
* Legg fila på en trygg plass på maskina di, f.eks. `/home/ola.nordmann/serviceaccounts/readme-arkiv.json`

Nå kan du kjøre opp Functions-emulator slik:

```
GOOGLE_APPLICATION_CREDENTIALS="<path-til-der-du-la-service-account.json>" firebase serve --only functions
```

Og deretter åpne ny terminal for å fyre opp frontenden:

```
npm start
```

## Deploy

For å sette dine endringer i produksjon, skal det ikke mer til enn

```
npm run deploy
```

Dette vil bygge klienten og deploye både den og functions.
