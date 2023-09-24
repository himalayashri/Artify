import { createApi } from "unsplash-js";
const unsplash = createApi({
  accessKey: "1PZXYusMtNzTlUghkse2-r9loiHF-1AOzyjeNuoHkiA",
});

/////creating variables

var posts = [];

/////importing elements

const allitems = document.getElementsByClassName("item");
var popup = document.getElementById("popup");

const logo = document.getElementById("logo");

const main = document.querySelector("#main");

const fav = document.getElementById("fav");

const input = document.getElementById("input");

///////////////////// Adding Search method

const search = document.getElementById("search");
search.addEventListener("click", () => {
  getImages(input.value);
});

//////////////// LOGO

logo.addEventListener("click", () => {
  getImages("Digital Art");
});

///////////////////// rendering FAVOURITES

const favPage = () =>
  fav.addEventListener("click", () => {
    const postss = JSON.parse(localStorage.getItem("posts"));
    const getPosts = postss.map((post) => {
      return `<img class="pics" src="${post.urls.small}" data-info="${post.id}" />`;
    });
    main.innerHTML = getPosts.join("");

    const getImage = (data, like = true) => {
      popup.innerHTML = `<div id="popup-inner">
<div id="big-pic">
<img src="${data[0].urls.small}" />
</div>
<div id="details">
<h3>Clicked By : ${data[0].user.name} </h3>
<h3>Description : ${data[0].alt_description} </h3>
<h3>Tags : ${data[0].tags[0].title}, ${data[0].tags[1].title}, ${
        data[0].tags[2].title
      } </h3>
<h3>Ig-username : ${data[0].user.username} </h3>
<button class="heart-rm">${
        like === true ? "Remove from Favourites ❤️" : "Removed from Favourites"
      }  </button>

</div>
</div>`;

      popup.addEventListener("click", (e) => {
        const target = e.target;
        const remove = document.getElementsByClassName("heart-rm");
        if (target.classList.contains("heart-rm")) {
          posts = posts.filter((post) => post.id !== data[0].id);
          updateLsData(posts);
        }
      });
    };

    const allPics = document.getElementsByClassName("pics");

    const getPicData = () =>
      Array.from(allPics).map((pic) => {
        pic.addEventListener("click", (e) => {
          const id = e.target.dataset.info;
          const picData = postss.filter((pic) => pic.id === id);
          popup.classList.toggle("display-none");
          if (main.style.opacity === "0.5") {
            main.style.opacity = "1";
          } else {
            main.style.opacity = "0.5";
          }
          getImage(picData);
        });
      });
    getPicData();

    const updateLsData = (posts) => {
      localStorage.setItem("posts", JSON.stringify(posts));
    };

    updateLsData(posts);
  });

favPage();

//////// GET IMAGES FROM UNSPLASH

const getImages = async (type) => {
  const result = await unsplash.search
    .getPhotos({
      query: type,
      page: 1,
      perPage: 30,
      orientation: "squarish",
    })
    .then((result) => {
      if (result.type === "success") {
        const photos = result.response.results;
        const getUrls = photos.map((i) => {
          return `<img class="pics" src="${i.urls.small}" data-info="${i.id}" />`;
        });

        main.innerHTML = getUrls.join("");

///////////////////// Render Single image on pop-up

        var like;
        const getImage = (data, like = false) => {
          popup.innerHTML = `<div id="popup-inner">
    <div id="big-pic">
    <img src="${data[0].urls.small}" />
    </div>
    <div id="details">
      <h3>Clicked By : ${data[0].user.name} </h3>
      <h3>Description : ${data[0].alt_description} </h3>
      <h3>Tags : ${data[0].tags[0].title}, ${data[0].tags[1].title}, ${
            data[0].tags[2].title
          } </h3>
      <h3>Ig-username : ${data[0].user.username} </h3>
      <button id="heart">${
        like ? "Added to Favourites ❤️" : "Add to Favourites 🤍"
      } </button>

    </div>
    </div>`;

//////////////// Adding image to favourites

          const heart = document.getElementById("heart");

          heart.addEventListener("click", (e) => {
            let post = posts.find((post) => post.id === data[0].id);
            if (!post) {
              posts.push(data[0]);
              getImage(data, true);
            } else {
              posts = posts.filter((post) => post.id !== data[0].id);
              getImage(data, false);
            }
          });
///////////////////// Storing favourite images to local storage

          const updateLsData = (posts) => {
            localStorage.setItem("posts", JSON.stringify(posts));
          };
          updateLsData(posts);
        };

//////////////////// retrieving data of single image

        const allPics = document.getElementsByClassName("pics");

        const getPicData = () =>
          Array.from(allPics).map((pic) => {
            pic.addEventListener("click", (e) => {
              const id = e.target.dataset.info;
              const picData = photos.filter((pic) => pic.id === id);
              popup.classList.toggle("display-none");
              if (main.style.opacity === "0.5") {
                main.style.opacity = "1";
              } else {
                main.style.opacity = "0.5";
              }
              getImage(picData);
            });
          });
        getPicData();
      }
    });
};
/////////////// Adding event to all item classes

Array.from(allitems).forEach((item) =>
  item.addEventListener("click", (e) => {
    getImages(e.target.textContent);
  })
);

/////////////////// calling all images once by default

getImages("Digital Art");
