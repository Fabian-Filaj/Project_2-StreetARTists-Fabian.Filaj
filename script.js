// Home Page
document.addEventListener("DOMContentLoaded", function () {
  // kapim emrat e artisteve dhe i vendosim tek dropdown
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json()) // e konvertojme response ne JSON
    .then((data) => {
      const artistList = document.getElementById("artistList"); //kapim me ID selectin nga HTML
      data.forEach((artist) => {
        // iterojme tek list e artisteve
        const option = document.createElement("option"); // krijojme nje element <option> i cili dod=t
        option.value = artist.name; //vleren e ktij option ja kalojme emrit te artistit
        option.textContent = artist.name; // vendosim si textContent e option tek emri i artistit
        artistList.appendChild(option); // i bejme append option tek dropdown
      });
    });

  const artistList = document.getElementById("artistList");
  // ky EventListener perdoret kur useri zgjedh nje artist nga dropdown
  artistList.addEventListener("change", function () {
    //perdorim "change" meqe kemi te bejme me disa vlera
    const selectedArtist = artistList.value; // vleren qe useri zgjedh e ruajm te selectedArtist

    // kjo kontrollon nese artisti i zgjedhur nuk eshte vet fjala "Choose", nese esht nuk ndodh gje, nese nuk esht vazhdon kodi:
    if (selectedArtist !== "Choose") {
      //ruhet artisti i zgjedhur ne localStorage
      localStorage.setItem("selectedArtist", selectedArtist);
      // ku rresht i ben redirect faqjes tek artist-Menu.html, ku si parameter URL ka emrin e artistit t zgjedhur
      window.location.href = `artist-Menu.html?artist=${encodeURIComponent(
        selectedArtist
      )}`;
    }
  });
});

//
//
//
// Visitor Home Page
// Alerti kur klikon ikonen e Auction
function showAlert() {
  alert("Auction coming soon!");
}

// Visitor Listing Page
// filtrimi
document.addEventListener("DOMContentLoaded", function () {
  // kapim ID e te gjitha elementeve te filtrimit nga HTML
  const filterButton = document.getElementById("filterButton"); //ikona e filtrimit
  const filterPanel = document.getElementById("filterPanel"); // containeri
  const closeFilterButton = document.getElementById("closeFilterButton"); //butoni X
  const applyFiltersButton = document.getElementById("applyFiltersButton"); // butoni √
  const itemList = document.getElementById("item-list"); //ktu shfaqen kartat
  const filterName = document.getElementById("filterName");
  const filterArtist = document.getElementById("filterArtist");
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const filterType = document.getElementById("filterType");

  // shfaqja e panelit te filtrimit kur klikohet butoni √
  filterButton.addEventListener("click", function () {
    filterPanel.classList.add("active");
  });

  // mbyllja e filter panel kur klikohet butoni X
  closeFilterButton.addEventListener("click", function () {
    filterPanel.classList.remove("active");
  });

  // kapim emrat e artisteve dhe i vendosim tek dropdown sic bem tek home page
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.name;
        option.textContent = user.name;
        filterArtist.appendChild(option);
      });
    });
  // ky rresht krijon nje array itemTypes qe permban item.type te vecant nga array items
  const itemTypes = Array.from(new Set(items.map((item) => item.type))); // perdorim  Array.from per te konvertuar setin e item.type ne nje array

  // iterojme tek cdo type tek array itemTypes
  itemTypes.forEach((type) => {
    const option = document.createElement("option"); //krijojme nje element option per dropdown-in
    option.value = type; //vleren e atributit te elementit option e vendos tek type
    option.textContent = type; //vendos type si textContent i elementit option
    filterType.appendChild(option); //elementin opdion e bejme append ne filterType
  });

  // funksioni i ben render items tek item-list(containeri ne html)
  function renderItems(filteredItems) {
    // i bejme clear listes
    itemList.innerHTML = "";
    //iterojem tek cdo item tek array filteredItems
    filteredItems.forEach((item, index) => {
      const card = document.createElement("div"); //krijojme nje element div per cod item
      card.classList.add("col-md-12"); //stilizim me bootstrap

      // if dhe else jane thjesht per ndryshimin e ngjyrave te tekstit dhe backgroundit te kartave ne indekse te ndryshme
      if (index % 2 === 0) {
        card.classList.add("even-card");
      } else {
        card.classList.add("odd-card");
      }
      // struktura e kartave
      card.innerHTML = `
        <div class="card"> 
          <img class="card-img-top" src="${item.image}" alt="${item.title}">
          <div class="card-body">
            <h1 class="card-title">${item.artist}</h1>          
            <p class="card-text text-end boxText">$${item.price}</p>
            <p class="card-text">${item.title}</p>
            <p class="card-artist"> ${item.description}</p>
          </div>
        </div>
      `;
      // i bejme append cdo karte ne itemList
      itemList.appendChild(card);
    });
  }

  // filtron items array qe te perfshije vetem ato items qe jane isPublished
  const publishedItems = items.filter((item) => item.isPublished);
  renderItems(publishedItems); //therrasim funksionin renderItems qe ti shfaqi fillimisht publishedItems

  // kur klikohen butoni √ aplikohen filtrat:
  applyFiltersButton.addEventListener("click", function () {
    let filteredItems = items.filter((item) => item.isPublished);

    // nga item title
    const name = filterName.value.toLowerCase(); // konvertorn vleren e filterName toLowerCase
    if (name) {
      filteredItems = filteredItems.filter(
        (
          item //filtron filteredItems
        ) => item.title.toLowerCase().includes(name)
      );
    }

    // nga artisti
    const artist = filterArtist.value;
    if (artist) {
      filteredItems = filteredItems.filter((item) => item.artist === artist);
    }

    //  nga cmimi
    const min = parseFloat(minPrice.value);
    const max = parseFloat(maxPrice.value);
    if (!isNaN(min)) {
      filteredItems = filteredItems.filter((item) => item.price >= min);
    }
    if (!isNaN(max)) {
      filteredItems = filteredItems.filter((item) => item.price <= max);
    }

    // tipi
    const type = filterType.value;
    if (type) {
      filteredItems = filteredItems.filter((item) => item.type === type);
    }

    renderItems(filteredItems);

    filterPanel.classList.remove("active");
  });
});

//
//
// Artist Menu Page
document.addEventListener("DOMContentLoaded", function () {
  // // kto rreshta vendosin tek h1 emrin e artisit te zgjedhur
  const urlParams = new URLSearchParams(window.location.search); // mer parametrin URL
  const artistName = urlParams.get("artist"); // mer vleren e parametrit artist

  // nese parametri ekziston:
  if (artistName) {
    // kapa me ID <h1> ku do te vendoset emri i artistit dhe si textContent vendosa emrin e artisit te zgjedhur
    document.getElementById("artistNameHeader").textContent = artistName;
    localStorage.setItem("selectedArtist", artistName); // e ruan ne local storage
  }
  // perllogarit total items sold dhe total income per artistin e zgjedhur
  function calculateArtistStats(artistName) {
    let totalItems = 0;
    let itemsSold = 0;
    let totalIncome = 0;

    // iterojme tek array items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // nese item i perket artistit te zgjedhur:
      if (item.artist === artistName) {
        totalItems++; // inkrementojme total items

        // nese item esht shitur
        if (item.dateSold) {
          itemsSold++; // inkrementojme itemsSold
          totalIncome += item.priceSold; // e shtojme cmimin e shitur tek totalIncome
        }
      }
    }
    // vlerat e mara i ruajme tek Total Items Sold dhe Total Income ne HTML
    document.getElementById(
      "totalItemsSold"
    ).textContent = `${itemsSold}/${totalItems}`;
    document.getElementById("totalIncome").textContent = `$${totalIncome}`;
  }

  // therrasim funksionin
  calculateArtistStats(artistName);
});

//
//
//
// // chart
document.addEventListener("DOMContentLoaded", function () {
  // kto rreshta marin parametrat URL dhe vleren e key "artist"
  const urlParams = new URLSearchParams(window.location.search);
  const artistName = urlParams.get("artist");

  // shfaqja e hamburgerMenu ne ekrane te vogla
  document
    .getElementById("hamburgerMenu")
    .addEventListener("click", function () {
      document.getElementById("dropdownMenu").classList.toggle("show");
    });

  // funksioni qe ben filtrimin e te dhenave bazuar ne kohen e zgjedhur
  function getFilteredData(range) {
    const endDate = new Date();
    let startDate;
    if (range === 365) {
      startDate = new Date(
        endDate.getFullYear() - 1,
        endDate.getMonth(),
        endDate.getDate()
      );
      // kjo llogarit daten fillestare dhe perfundimtare per te dhenat bazuar tek range i dhene
    } else {
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - range);
    }

    // filtrohet items array qe te perfshihen vetem ato items qe bejene match me emrin e artisit dhe qe bien te llogaritja e data range
    const filteredItems = items.filter((item) => {
      const itemDate = new Date(item.dateSold);
      return (
        item.artist === artistName &&
        itemDate >= startDate &&
        itemDate <= endDate
      );
    });

    // i bejme map filteredItems tek nje array me objekte, ku jane te dhenat qe na duhen
    return filteredItems.map((item) => ({
      dateSold: item.dateSold,
      priceSold: item.priceSold,
      originalPrice: item.price,
    }));
  }

  // funksioni qe i ben render charteve
  function renderChart(range) {
    // kto rreshtat marin dateSold, priceSold, dhe originalPrice nga filteredData dhe i ruajne ato ne array te ndara
    const filteredData = getFilteredData(range);
    const labels = filteredData.map((data) => data.dateSold);
    const soldPrices = filteredData.map((data) => data.priceSold);
    const originalPrices = filteredData.map((data) => data.originalPrice);

    // struktura e chartit
    myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Original Price",
            data: originalPrices,
            backgroundColor: "#1B59AC",
          },
          {
            label: "Price Sold",
            data: soldPrices,
            backgroundColor: "#A16A5E",
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 250,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                // shfaqja e datave qe items jane shitur ne boshtin e Y
                return labels[index]
                  ? new Date(labels[index]).toLocaleDateString()
                  : "";
              },
            },
          },
        },
      },
    });
  }

  const ctx = document.getElementById("myChart").getContext("2d");
  let myChart;

  renderChart(30); // shfaqja e te dhenave per 30 ditet e fundit
});

//
//
// Artist Items
document.addEventListener("DOMContentLoaded", function () {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  const itemList = document.getElementById("item-list");
  const artistNameHeader = document.getElementById("artistNameHeader");

  const selectedArtistName =
    localStorage.getItem("selectedArtist") || "Unknown Artist";
  artistNameHeader.textContent = selectedArtistName;

  function formatDate(dateString) {
    return dateString.split("T")[0];
  }

  function renderItems(items) {
    itemList.innerHTML = "";
    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("col-md-12", "mt-3");
      card.classList.add(index % 2 === 0 ? "even-card" : "odd-card");

      const buttonClass = item.isPublished ? "btn-danger" : "btn-success";
      const buttonText = item.isPublished ? "Unpublish" : "Publish";

      card.innerHTML = `
        <div class="card">
          <img class="card-img-top" src="${item.image}" alt="${item.title}">
          <div class="card-body">
            <h1 class="card-title">${item.title}</h1>
            <p class="card-text text-end boxText">$${item.price}</p>
            <p class="card-text">${formatDate(item.dateCreated)}</p>
            <p class="card-artist">${item.description}</p>
            <button class="btn ${buttonClass} publish-toggle">${buttonText}</button>
            <button class="btn btn-dark remove-item">Remove</button>
            <button class="btn btn-light edit-item">Edit</button>
          </div>
        </div>
      `;

      itemList.appendChild(card);

      //  event listener per buttons
      card
        .querySelector(".remove-item")
        .addEventListener("click", () => removeItem(item, card));
      card
        .querySelector(".edit-item")
        .addEventListener("click", () => editItem(item));
      card
        .querySelector(".publish-toggle")
        .addEventListener("click", () => togglePublish(item, card));
    });
  }

  function removeItem(item, card) {
    if (confirm("Are you sure you want to remove this item?")) {
      const index = items.findIndex((i) => i.id === item.id);
      if (index > -1) {
        items.splice(index, 1);
        localStorage.setItem("items", JSON.stringify(items));
        card.remove();
      }
    }
  }

  function editItem(item) {
    localStorage.setItem("editItem", JSON.stringify(item));
    window.location.href = "artist-edit.html";
  }

  function togglePublish(item, card) {
    item.isPublished = !item.isPublished;
    localStorage.setItem("items", JSON.stringify(items));
    const button = card.querySelector(".publish-toggle");
    button.textContent = item.isPublished ? "Unpublish" : "Publish";
    button.classList.toggle("btn-success", !item.isPublished);
    button.classList.toggle("btn-danger", item.isPublished);
  }

  const filteredItems = items.filter(
    (item) => item.artist === selectedArtistName
  );
  renderItems(filteredItems);
});

//
//
//Artist-Edit page
document.addEventListener("DOMContentLoaded", function () {
  const itemForm = document.getElementById("itemForm");
  const itemTitle = document.getElementById("itemTitle");
  const itemDescription = document.getElementById("itemDescription");
  const itemType = document.getElementById("itemType");
  const itemPrice = document.getElementById("itemPrice");
  const itemImage = document.getElementById("itemImage");
  const isPublished = document.getElementById("isPublished");
  const formTitle = document.getElementById("formTitle");
  const cancelButton = document.getElementById("cancelButton");

  itemTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    itemType.appendChild(option);
  });

  const editItem = JSON.parse(localStorage.getItem("editItem"));

  if (editItem) {
    formTitle.textContent = "Edit Item";
    itemTitle.value = editItem.title;
    itemDescription.value = editItem.description;
    itemType.value = editItem.type;
    itemPrice.value = editItem.price;
    itemImage.value = editItem.image;
    isPublished.checked = editItem.isPublished;
  }

  itemForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedItem = {
      ...editItem,
      title: itemTitle.value,
      description: itemDescription.value,
      type: itemType.value,
      price: parseFloat(itemPrice.value),
      image: itemImage.value,
      isPublished: isPublished.checked,
      dateCreated: editItem ? editItem.dateCreated : new Date().toISOString(),
      artist: editItem
        ? editItem.artist
        : localStorage.getItem("selectedArtist"),
      dateSold: editItem ? editItem.dateSold : null,
      priceSold: editItem ? editItem.priceSold : null,
    };

    let items = JSON.parse(localStorage.getItem("items")) || [];

    if (editItem) {
      items = items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
    } else {
      updatedItem.id = Date.now();
      items.push(updatedItem);
    }

    localStorage.setItem("items", JSON.stringify(items));

    localStorage.removeItem("editItem");

    window.location.href = "artist-items.html";
  });

  cancelButton.addEventListener("click", function () {
    localStorage.removeItem("editItem");

    window.location.href = "artist-items.html";
  });
});

function updateItemInLocalStorage(itemId, updatedItem) {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items = items.map((item) => (item.id === itemId ? updatedItem : item));
  localStorage.setItem("items", JSON.stringify(items));
}

function togglePublishStatus(itemId) {
  let items = JSON.parse(localStorage.getItem("items")) || [];
  items = items.map((item) => {
    if (item.id === itemId) {
      item.isPublished = !item.isPublished;
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
}

document.getElementById("publishButton").addEventListener("click", function () {
  const itemId = togglePublishStatus(itemId);
});
