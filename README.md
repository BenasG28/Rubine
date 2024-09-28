# RUBINĖ

## Aplinka
Aš naudoju IntelliJ IDEA 2024.2.3 (Ultimate Edition), patariu ir Jums. Mažiau knisalo, jei kažkokia problema. Licenzijas turėtumėt turėti.

## Duomenų bazė
Naudojama **MariaDB** duomenų bazė. Norint pasileisti projektą lokaliai, reikia sukurti duomenų bazę su šiais parametrais:
- **Pavadinimas:** `rubine_db`
- **User:** `root`
- **Password:** `root`

## Install'ai
Norint pasileisti projektą, gali reikėti instaliuoti keletą dalykų. Pasirūpinkit, kad turite įdiegtas šias priklausomybes:

### Front-End
- **Node.js** ir **npm**  
  *(Man npm atėjo kartu su Node.js, jei pas jus kitaip – įdiekite atskirai.)*

### Back-End
- **Java SDK**  
  *(Aš naudoju Azul Zulu JDK 21.0.4)*
- **Maven**

*Atkreipkite dėmesį, kad kažkas gali būti praleista. 😊*

## Priklausomybių įdiegimas

### Front-End
1. **Nueiti į front-end folder'į:**
   ```sh
   cd front-end
2. **Prasukti:**
   ```sh
   npm install
### Back-End   
1. **Nueiti į back-end folder’į:**
   ```sh
   cd back-end
2. **Prasukti:**
   ```sh
   mvn clean install

## Projekto paleidimas

### Front-End
1. **Nueiti į front-end folder'į:**
   ```sh
   cd front-end
2. **Prasukti:**
   ```sh
   npm start
### Back-End   
1. **Nueiti į back-end folder’į:**
   ```sh
   cd back-end
2. **Prasukti:**
   ```sh
   mvn spring-boot:run
   
  *(Viską galima supaprastinti prisikabinus front'ą ir back'ą per Intellij run configuration)*

   
