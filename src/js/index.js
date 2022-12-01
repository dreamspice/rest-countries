import "./../sass/main.scss";
const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".form__input");
const countriesEl = document.querySelector(".countries");
const inputEls = document.querySelector(".input-elements");
const selectEl = document.querySelector(".select");
const buttonTheme = document.querySelector(".nav__mode");
// storing data
const state = {
  data: {},
  currentCountry: {},
  filterCountries: {},
};

// load all countries after page load finished
window.addEventListener("load", function () {
  getAllCountries();
});

// search country and display it
formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (inputEl.value) {
    getSearchedCountry(inputEl.value);
  } else {
    countriesEl.textContent = "";
    getAllCountries();
  }
});

// get all countries
const getAllCountries = async function () {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    const data = await res.json();
    state.data = data.map((data) => {
      return {
        name: data.name.common,
        population: data.population,
        region: data.region,
        capital: data.capital,
        img: data.flags.svg,
        subregion: data.subregion,
        domain: data.tld,
      };
    });

    // sorting countries a-z
    state.data.sort(function (x, y) {
      let a = x.name.toUpperCase(),
        b = y.name.toUpperCase();
      return a === b ? 0 : a > b ? 1 : -1;
    });
    // generate markup for each country
    state.data.forEach((_, i) => {
      const html = `
  <div class="countries__country">
  <div class="countries__country-flag">
    <img
      class="countries__country-flag--img"
      src="${state.data[i].img}"
    />
  </div>
  <div class="countries__details">
    <p class="countries__details--name">${state.data[i].name}</p>
    <p class="countries__details--population">Population: ${state.data[i].population}</p>
    <p class="countries__details--region">Region: ${state.data[i].region}</p>
    <p class="countries__details--capital">Capital: ${state.data[i].capital}</p>
  </div>
</div>
  `;
      // display countries
      countriesEl.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.error(err.message);
  }
};

// get searched country
const getSearchedCountry = async function (country) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    const [data] = await res.json();
    console.log(data);
    state.currentCountry = {
      flag: data.flags.svg,
      name: data.name.common,
      population: data.population,
      region: data.region,
    };
    // generate markup
    const html = `
  <div class="countries__country">
  <div class="countries__country-flag">
    <img
      class="countries__country-flag--img"
      src="${data.flags.svg}"
    />
  </div>
  <div class="countries__details">
    <p class="countries__details--name">${data.name.common}</p>
    <p class="countries__details--population">Population: ${data.population}</p>
    <p class="countries__details--region">Region: ${data.region}</p>
    <p class="countries__details--capital">Capital: ${data.capital}</p>
  </div>
</div>
  `;
    countriesEl.textContent = "";
    countriesEl.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error(err.message);
  }
};

// is about clicking country container
countriesEl.addEventListener("click", async function (e) {
  try {
    const el = e.target.closest(".countries__country");
    if (!el) return;

    // get name of clicked country
    let nameOfCountry = el.childNodes[3].firstElementChild.textContent;

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${nameOfCountry}`
    );
    const [data] = await res.json();
    // store it to current country
    state.currentCountry = {
      flag: data.flags.svg,
      name: data.name.common,
      population: data.population,
      region: data.region,
      subregion: data.subregion,
      capital: data.capital,
      domain: data.tld,
      borders: data.borders,
    };
    countriesEl.textContent = "";
    // generate markup
    const html = `<div class="country">
  <button class="country__button"><span>&larr;</span>Back</button>
  <div class="country-flag">
    <img class="country-flag--img" src="${state.currentCountry.flag}" />
  </div>
  <div class="country__details">
  
    <p class="country__details--name">${state.currentCountry.name}</p>
    <p class="country__details--native-name">Native Name:<span class="country__details--data">${
      state.currentCountry.name
    }</span></p>
    <p class="country__details--population">Population:<span class="country__details--data">${
      state.currentCountry.population
    }</span></p>
    <p class="country__details--region">Region:<span class="country__details--data">${
      state.currentCountry.region
    }</span></p>
    <p class="country__details--subregion">Sub Region:<span class="country__details--data">${
      state.currentCountry.subregion
    }</span></p>
    <p class="country__details--capital">Capital:<span class="country__details--data">${
      state.currentCountry.capital
    }</span></p>

    <p class="country__details--domain">Top Level Domain:<span class="country__details--data">${
      state.currentCountry.domain
    }</span></p>

    <p class="country__details--borders">Border Countries:<span class="country__details--data">${
      state.currentCountry.borders
        ? state.currentCountry.borders.join(", ")
        : "None"
    }</span></p>
  </div>
</div>`;
    // display country details
    inputEls.style.opacity = "0";
    countriesEl.insertAdjacentHTML("afterbegin", html);

    // back to showing all countries
    const btn = document.querySelector(".country__button");
    btn.addEventListener("click", function () {
      inputEls.style.opacity = "1";
      countriesEl.textContent = "";
      inputEl.value = "";
      getAllCountries();
    });
  } catch (err) {
    console.error(err.message);
  }
});

selectEl.addEventListener("change", function (e) {
  countriesEl.textContent = "";
  const selectedValue = e.target.value;
  if (!selectedValue) getAllCountries();
  const data = state.data.filter((data) => data.region === selectedValue);
  data.forEach((_, i) => {
    const html = `
<div class="countries__country">
<div class="countries__country-flag">
  <img
    class="countries__country-flag--img"
    src="${data[i].img}"
  />
</div>
<div class="countries__details">
  <p class="countries__details--name">${data[i].name}</p>
  <p class="countries__details--population">Population: ${data[i].population}</p>
  <p class="countries__details--region">Region: ${data[i].region}</p>
  <p class="countries__details--capital">Capital: ${data[i].capital}</p>
</div>
</div>
`;
    // display countries
    countriesEl.insertAdjacentHTML("beforeend", html);
  });
});

let theme = localStorage.getItem("data-theme");
document.documentElement.setAttribute("data-theme", theme);

if (theme === "dark") {
  buttonTheme.textContent = "☀️ Light mode";
} else {
  buttonTheme.textContent = "🌚 Dark mode";
}

const changeThemeToDark = () => {
  document.documentElement.setAttribute("data-theme", "dark"); // set theme to dark
  localStorage.setItem("data-theme", "dark"); // save theme to local storage
};

const changeThemeToLight = () => {
  document.documentElement.setAttribute("data-theme", "light"); // set theme light
  localStorage.setItem("data-theme", "light"); // save theme to local storage
};

buttonTheme.addEventListener("click", () => {
  let theme = localStorage.getItem("data-theme"); // Retrieve saved them from local storage
  console.log(theme);
  if (theme === "dark") {
    changeThemeToLight();
    buttonTheme.textContent = "🌚 Dark mode";
  } else {
    changeThemeToDark();
    buttonTheme.textContent = "☀️ Light mode";
  }
});
