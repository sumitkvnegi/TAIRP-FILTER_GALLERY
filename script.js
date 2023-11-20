import { API } from "./api.js";

const filterList = document.getElementById("filterList");
const allBtn = document.getElementById("allBtn");
const filterType = document.getElementById("filter-type");
const columns = [
  document.querySelector(".column1"),
  document.querySelector(".column2"),
  document.querySelector(".column3"),
  document.querySelector(".column4"),
  document.querySelector(".column5"),
  document.querySelector(".column6"),
];
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const slide = document.getElementById("slide");
let data;

const fetchData = async () => {
  const data = await fetch(API);
  const json = await data.json();
  localStorage.setItem("data", JSON.stringify(json.hits));
  return json.hits;
};

const appendImagesInGrid = (data) => {
  const totalColumns = columns.length;
  slide.innerHTML = "";
  cleanColumn();
  data.forEach((item, index) => {
    const img = document.createElement("div");
    img.style.backgroundImage = `url(${item.largeImageURL
    })`;
    if (index == 0) {
      img.classList.add("image","visible");
    } else {
      img.classList.add("image");
    }
    slide.appendChild(img);
    const div = document.createElement("div");
    div.innerHTML = `<img src=${item.largeImageURL
    } class="images2" alt="">`;
    const columnIndex = index % totalColumns; // Determine the target column
    columns[columnIndex].appendChild(div);
  });
};

const categorizeData = (data) => {
  const categories = {};
  data.forEach((item) => {
    const tags = item.tags.split(", ").map((tag) => tag.toLowerCase());
    tags.forEach((tag) => {
      if (!categories[tag]) {
        categories[tag] = [];
      }
      categories[tag].push(item);
    });
  });
  localStorage.setItem("categoriesData", JSON.stringify(categories));
  return categories;
};

const createCategoryButtons = (categories) => {
  for (const category in categories) {
    const li = document.createElement("li");
    li.innerText = category;
    li.addEventListener("click", () => {
      displayCategoryData(category);
    });
    filterList.appendChild(li);
  }
};

const cleanColumn = () => {
  const totalColumns = columns.length;
  for(let i=0; i<totalColumns; i++){
    columns[i].innerHTML = "";
  }
}

const displayCategoryData = (category) => {
  filterType.innerText = category;
  const categorizedData = JSON.parse(localStorage.getItem("categoriesData"));
  const categoryData = categorizedData[category];
  const totalColumns = columns.length;
  cleanColumn();
  categoryData.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<img src=${item.largeImageURL
    } class="images2" alt="">`;
    const columnIndex = index % totalColumns; // Determine the target column
    columns[columnIndex].appendChild(div);
  });
};

const allImages = async () => {
  data = localStorage.getItem("data");
  if (!data) {
    data = await fetchData();
    console.log(data);
  } else {
    data = JSON.parse(data);
    console.log(data);
  }
  appendImagesInGrid(data);
  const categorizedData = categorizeData(data);
  createCategoryButtons(categorizedData);
};

document.addEventListener("DOMContentLoaded", function () {
  allBtn.addEventListener("click", allImages);
  allImages();
});

const images = slide.getElementsByTagName("div");

let currentIndex = 0;

leftArrow.addEventListener("click", () => {
  images[currentIndex].classList.remove("visible");
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  images[currentIndex].classList.add("visible");
});

rightArrow.addEventListener("click", () => {
  images[currentIndex].classList.remove("visible");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.add("visible");
});
