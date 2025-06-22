const domain = "https://www.huyvu.dk/";

// Endpoints for madretter og drikkevarer
const postsEndpointMad = "wp-json/wp/v2/madret";
const postsEndpointDrikke = "wp-json/wp/v2/drikkevare";

// per_page er en parameter der gør det muligt at hente flere elementer ad gangen.
// Den normale limit er 10, med dette kan vi hente 25 ad gangen.
const morePages = "?per_page=25";

// Endpoints for taxonomi kategorier (fx. læskedrikke, varm kaffe, kold kaffe, Snacks, Morgenmad osv.)
const postsEndpointMadKategori = "wp-json/wp/v2/mad_kategori";
const postsEndpointDrikkeKategori = "wp-json/wp/v2/drikke_kategori";

// Html element hvor vi indsætter vores resultater
const madContainer = document.querySelector(".mad-container");
const drikkeContainer = document.querySelector(".drikke-container");

// Mangler at lave tags om til emojis
// Emoji-ikon map til tags
const tagIcons = {
  Vegansk: "🌱",
  Børnevenlig: "🧒",
  Glutenfri: "🌾",
  "Caféens Anbefaling": "👍",
  "Mest populære": "⭐",
};

// fetch for at hente madkategorier
async function getPublicFoodCategories() {
  // Try catch blok, endten virker det eller så fanger den en fejl.
  try {
    // Henter data fra API'et ved at fetch domain og endpoint
    const response = await fetch(domain + postsEndpointMadKategori);
    // Konventerer svaret til JSON format som er objekt format
    const foodCategories = await response.json();
    // Returnerer de hentede madkategorier så vi kan bruge dem senere
    return foodCategories;
  } catch (error) {
    console.log("det virker ikke", error);
  }
}

// fetch food items
async function getPublicFoodItems() {
  try {
    const response = await fetch(domain + postsEndpointMad + morePages);
    const foodItems = await response.json();
    return foodItems;
  } catch (error) {
    console.log("det virker ikke", error);
  }
}

// fetch for at hente drikkekategorier
async function getPublicDrinkCategories() {
  try {
    const response = await fetch(domain + postsEndpointDrikkeKategori);
    const drinkCategories = await response.json();
    return drinkCategories;
  } catch (error) {
    console.log("det virker ikke", error);
  }
}

// fetch drink items
async function getPublicDrinkItems() {
  try {
    const response = await fetch(domain + postsEndpointDrikke + morePages);
    const drinkItems = await response.json();
    return drinkItems;
  } catch (error) {
    console.log("det virker ikke", error);
  }
}

// Render mad og madkategorier
function renderFoods(foodCategories, foodItems) {
  // Tømmer madContainer for tidligere resultater
  madContainer.innerHTML = "";

  foodCategories.forEach((category) => {
    // innerHTML ind i madContainer for hver mad kategori fx. "Snacks", "Morgenmad", osv.
    madContainer.innerHTML += `
    <div class="category"> 
    <h2>${category.name}</h2>
    </div>
    `;

    // Filtrerer madretter for at finde dem der matcher med deres kategori ID
    // Filtrer specifikt foodItems(madretter) at de inderholder mad_kategori(som er ID) som matcher med category.id
    const matchingIDs = foodItems.filter((foodItem) =>
      foodItem.mad_kategori.includes(category.id)
    );

    // Hvis der er madretter i denne kategori, så render dem
    if (matchingIDs.length > 0) {
      matchingIDs.forEach((id) => {
        madContainer.innerHTML += `
        <div class="foodItem">
        <div class="foodText"> 
        <div class="foodTitleTags"> 
        <h3>${id.title.rendered}</h3>

        <!-- 
        // Vi tjekker om tags er over 0 fordi hvis den er over 0 er det et array, under er den en string, (fordi feltet ikke er udfyldt field groups cms)
        // hvis array, så bruger vi join (array function) det konventere array til en string så vi kan bruge det i HTML.
        // Example: ["Vegansk", "Glutenfri"] bliver til "Vegansk Glutenfri"
        // "?" og ":" er ternary operators der fungerer som en kortere if-else
        // enten ?joiner vi arrayet eller :retunere vi en tom string.
        -->
        <p>          
          ${
            // id.acf.tags.length > 0 hvis den er over 0 kører vi tenary operators som er "?", hvis den er under 0 vil det bare bilve en tom string ""
            id.acf.tags.length > 0 //id.acf.tags vil nu vise emojis istedet for "Vegansk", "Glutenfri" da vi har erklæret en variabel længere oppe der siger vi skal erstatte det med emojojis.
              ? id.acf.tags // Hele denne stykke kode checker vi om tag feltet findes og er den længere end 0 altså mindst et tag hvis ja så kører vi koden ellers vises tom felt som ""
                  .map((tag) => tagIcons[tag]) // Det er her jeg snakker om "Vegansk, "Glutenfri" Vil blive til ikoner istedet for da vi erklæret en variabel længere oppe.
                  .filter(Boolean) // Den sikrer at vi kun får emojis vist, hvis du fx skriver forkert navn i const og den hedder noget andet på websitet vil den ikke vises.(Fx Vegansk skal staves ensartet begge stedet før emojis erstatter/vises) Hvis vi ikke havde dette, ville der stå undefined. Hvis de var skrevet forkert.
                  .join(" ") // Her siger vi bare ikoner skal ind med mellemrum da vi skriver " " <-  med spacing
              : "" // Hvis tags.length er under 0 laver vi tenary operator som giver en tom string.
          }
        </p>
        </div>
        <p>${id.acf.beskrivelse}</p>
        
        <!-- 
        Javascript linjeskift er \n, men vi vil erstatte det med HTML-linjeskift <br>.
        /.../ er en regular expression (mønstersøgning), og i dette tilfælde leder vi efter \n - derfor skriver vi /\n/.
        Bogstavet g til sidst står for "global", hvilket betyder, at alle forekomster af \n bliver fundet og erstattet - ikke kun den første.
        Eksempel: -ost 15kr\n-knas 10kr\n-smør 5kr, ville ellers blive til -ost 15kr<br>-knas 10kr\n-smør 5kr uden g.
        Man kunne også skrive <br> i wordpress under Tilkøb, men vi har valgt at gøre det på denne måde.
        -->
        <p>${id.acf.tilkob.replace(/\n/g, "<br>")}</p> 
        </div> 
        <div class="foodPrice"> 
        <h3>${id.acf.pris},-</h3>
        </div>
        </div>
        `;
      });
    } else {
      madContainer.innerHTML += `<p>Fejl ingen elementer i denne kategori.</p>`;
    }
  });
}

// Her laver vi en asynkron funktion initFoods for at hente madretter og kategorier
// Det kan  vi gøre fordi vi har returnet de data fra vores fetch funktioner.
async function initFoods() {
  try {
    // Venter på at hente madkategorier og madretter fra API'et
    const foodCategories = await getPublicFoodCategories();
    const foodItems = await getPublicFoodItems();

    // Logger de hentede data til konsollen for debugging
    console.log(foodCategories); // array af 5
    console.log(foodItems); // array af 12

    // Kalder renderFoods med de hentede data
    renderFoods(foodCategories, foodItems);
  } catch (error) {
    console.log(error);
    madContainer.innerHTML = `Der gik noget galt3`;
  }
}
// Her laver vi en asynkron funktion initDrinks for at hente drikkevarer og kategorier
// Det kan  vi gøre fordi vi har returnet de data fra vores fetch funktioner.
async function initDrinks() {
  try {
    // Venter på at hente drikkekategorier og drikkevarer fra API'et
    const drinkCategories = await getPublicDrinkCategories();
    const drinkItems = await getPublicDrinkItems();

    // Logger de hentede data til konsollen for debugging
    console.log(drinkCategories);
    console.log(drinkItems);

    // Kalder renderDrinks med de hentede data
    renderDrinks(drinkCategories, drinkItems);
  } catch (error) {
    console.log(error);
    drikkeContainer.innerHTML = `Der gik noget galt`;
  }
}
function renderDrinks(drinkCategories, drinkItems) {
  drikkeContainer.innerHTML = "";

  drinkCategories.forEach((category) => {
    drikkeContainer.innerHTML += `
      <div class="category"> 
        <h2>${category.name}</h2>
      </div>
    `;

    const matchingIDs = drinkItems.filter((drinkItem) =>
      drinkItem.drikke_kategori.includes(category.id)
    );

    if (matchingIDs.length > 0) {
      matchingIDs.forEach((id) => {
        drikkeContainer.innerHTML += `
          <div class="foodItem">
            <div class="foodText"> 
              <div class="foodTitleTags"> 
                <h3>${id.title.rendered}</h3>
              </div>
              <p>${id.acf.beskrivelse}</p>
              <p>${id.acf.tilkob}</p>
            </div> 
            <div class="foodPrice"> 
              <h3>${id.acf.pris},-</h3>
            </div>
          </div>
        `;
      });
    } else {
      drikkeContainer.innerHTML += `<p>Fejl - ingen elementer i denne kategori.</p>`;
    }
  });
}

// vis eller skjul sektioner
const madButton = document.querySelector(".madButton");
const drikkeButton = document.querySelector(".drikkeButton");

function visMad() {
  madContainer.style.display = "block";
  drikkeContainer.style.display = "none";
  document.querySelector(".menu-text").style.display = "block"; // Vis tekst
  document.querySelector(".menuDrinkTopText").style.display = "none"; // Skjul tekst

  document.querySelector(".h1-spisekort").style.display = "block";
  document.querySelector(".h1-drikkekort").style.display = "none";

  document.querySelector(".madRetHeroImg").style.display = "block";
  document.querySelector(".drikkeVarerHeroImg").style.display = "none";

  madButton.classList.add("animationActive");
  drikkeButton.classList.remove("animationActive");
}
function visDrikke() {
  madContainer.style.display = "none";
  drikkeContainer.style.display = "block";
  document.querySelector(".menuDrinkTopText").style.display = "block"; // Vis tekst
  document.querySelector(".menu-text").style.display = "none"; // Skjul tekst

  // Vis/skjul overskrifter
  document.querySelector(".h1-spisekort").style.display = "none";
  document.querySelector(".h1-drikkekort").style.display = "block";

  document.querySelector(".madRetHeroImg").style.display = "none";
  document.querySelector(".drikkeVarerHeroImg").style.display = "block";

  drikkeButton.classList.add("animationActive");
  madButton.classList.remove("animationActive");
}

// Start side
initFoods();
initDrinks();
