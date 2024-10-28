# ColorBox

## Përmbledhje
Color Box është një aplikacion interaktiv që i lejon përdoruesit të ndryshojnë ngjyrën e një kutie përmes një kliku, të mbajnë gjurmë të klikimeve, si dhe të undo/redo ngjyrat e mëparshme. Një buton **Reset** i kthen kutisë ngjyrën fillestare dhe pastron historikun e ngjyrave.

---

## Struktura e Kodit

### Skedarët Kryesorë
- **index.html**: Përmban strukturën kryesore të dokumentit HTML, duke përfshirë elementët vizualë dhe ndërfaqen e përdoruesit.
- **style.css**: Përmban rregullat e stilizimit për krijimin e një ndërfaqeje të pastër dhe tërheqëse, të përshtatshme për desktop dhe celular.
- **script.js**: Përmban funksionet kryesore që drejtojnë ndryshimet e ngjyrës, historikun e ngjyrave dhe funksionalitetet e klikimeve.

---

## Përshkrimi i Komponentëve dhe Funksioneve

### 1. Skedari HTML: **index.html**
    - Përmban elementët bazë të HTML që përfaqësojnë përmbajtjen vizuale të aplikacionit.
    - **Struktura e Elementëve**:
      - **Titulli dhe Nën-titulli** (`<h1>` dhe `<h2>`): Shfaqin titullin e aplikacionit dhe përshkrimin "Let’s Color".
      - **ColorBox** (`<div id="color-box">`): Një kuti interaktive që ndryshon ngjyrën kur klikohet butoni **Color**. Ky element përfshin edhe një clickcounter të klikimeve.
      - **Butonat e Kontrollit**: Përfshin butonat **Color**, **Undo**, **Reset** dhe **Redo**, të cilët kontrollojnë ndryshimet e ngjyrës dhe historikun e veprimeve të përdoruesit.

### 2. Skedari CSS: **style.css**
    - Rregullon stilizimin e elementeve, duke përfshirë ngjyrat, madhësitë, hapësirat dhe reagimin ndaj përmasave të ekranit.
    - **Rregullat Kryesore**:
      - **Stilizimi i Kutisë së Ngjyrave** (`#color-box`): Kutia ka një përmasë të caktuar, ngjyrë sfondi, dhe kufij të rrumbullakët. Në versionin për celular, rregullat sigurojnë që kutia të përshtatet mirë në ekranet e vogla.
      - **Stilizimi i Butonave** (`#undo-btn`, `#redo-btn`, `#color-btn`, `#reset-btn`): Butonat kanë ngjyrë uniforme, që ndryshon kur kalon mouse (hover) mbi to. Butonat janë të përshtatshëm edhe për shikim në ekranet e celularëve.
      - **Titujt** (`h1`, `h2`): Janë stilizuar për të qenë të qartë dhe të lexueshëm, të vendosur afër njëri-tjetrit për një pamje më të rregullt.

---

### 3. Funksionet Kryesore JavaScript: **script.js**

#### a. Funksioni `getRandomColor`
   - **Qëllimi**: Gjeneron një ngjyrë të rastësishme për kutinë e ngjyrave.
   - **Logjika**: 
     - Gjeneron tri vlera të rastësishme (R, G dhe B) për të krijuar një ngjyrë në formatin RGB.
     - Bën disa kontrolle për të siguruar që ngjyra të mos jetë shumë e errët ose shumë e ndritshme për të siguruar kontrastin e duhur me clickcounterin.

#### b. Funksioni `getContrastingColor`
   - **Qëllimi**: Vendos ngjyrën e numëratorit të klikimeve në kontrast  me ngjyrën e kutisë.
   - **Logjika**:
     - Përllogarit ndriçimin e ngjyrës së kutisë bazuar në vlerat RGB.
     - Kthen `black` ose `white` në varësi të ndriçimit, duke siguruar kontrast të qartë për shikueshmërinë e numrit të klikimeve.

#### c. Funksioni `updateUndoRedoLists`
   - **Qëllimi**: Përditëson listat për ngjyrat e mëparshme dhe të ardhshme.
   - **Logjika**:
     - Gjeneron elementë të rinj në listat `undo-list` dhe `redo-list` për çdo ngjyrë të ruajtur.
     - I lejon përdoruesit të tërheqë dhe vendosë ngjyrat midis listave, duke ruajtur historikun e ndryshimeve të ngjyrës.

#### d. Funksioni `Color Button Click`
   - **Qëllimi**: Ndryshon ngjyrën e kutisë në një ngjyrë të re dhe përditëson clickcountin.
   - **Logjika**:
     - Shton ngjyrën aktuale në listën e undo dhe pastron listën e redo për t’i lejuar përdoruesit të rikthehet te ngjyrat e mëparshme.
     - Përditëson clickcountin dhe ngjyrën e sfondit të kutisë.

#### e. Funksioni `Undo Button Click`
   - **Qëllimi**: Rikthen ngjyrën e mëparshme të kutisë.
   - **Logjika**:
     - Zhvendos ngjyrën aktuale në listën e redo dhe e zëvendëson atë me ngjyrën e fundit nga lista e undo.
     - Përditëson gjithashtu ngjyrën e numëratorit për kontrastin e duhur.

#### f. Funksioni `Redo Button Click`
   - **Qëllimi**: Rivendos ngjyrën e kutisë në një ngjyrë që ishte në redo list.
   - **Logjika**:
     - Zhvendos ngjyrën aktuale në listën e undo dhe vendos ngjyrën e fundit të ribllokuar në colorbox.

#### g. Funksioni `Reset Button Click`
   - **Qëllimi**: Rivendos colorbox në gjendjen fillestare, me ngjyrë dhe numërim klikimesh të fshirë.
   - **Logjika**:
     - Përcakton ngjyrën e kutisë në ngjyrën parazgjedhje (`#f0f8ff`) dhe rivendos numëratorin e klikimeve në zero, me tekstin e tij në ngjyrë të zezë për lehtësinë e leximit.
     - Pastron të gjitha elementët e ruajtur në listat e zhbllokimit dhe ribllokimit.

---

## Udhëzime për Përdorim

1. **Color**: Klikoni në butonin **Color** për të ndryshuar ngjyrën e kutisë në një ngjyrë të rastësishme dhe për të rritur numërimin e klikimeve.
2. **Undo**: Klikimi në **Undo** rikthen ngjyrën e mëparshme të kutisë duke lejuar rikthim të veprimeve.
3. **Redo**: Nëse keni zhbllokuar një ngjyrë, klikimi në **Redo** rikthen ngjyrën e fundit të zhbllokuar.
4. **Reset**: Klikimi në **Reset** e kthen kutinë në ngjyrën e saj fillestare dhe rivendos numëratorin e klikimeve në zero, duke pastruar listat e zhbllokimit dhe ribllokimit.

Ky përshkrim u siguron përdoruesve një kuptim të plotë të strukturës dhe funksioneve të këtij projekti në JavaScript.
