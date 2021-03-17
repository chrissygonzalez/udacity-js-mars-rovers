let store = {
  user: { name: 'Student' },
  apod: '',
  rovers: {
    selected: '',
    curiosity: {},
    opportunity: {},
    spirit: {},
  },
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store).then(initRoverMenu);
  debugger;
};

let roverMenu;

const initRoverMenu = () => {
  roverMenu = document.getElementById('RoverSelect');
  roverMenu.onchange = (e) => {
    if (e.target.value === 'Curiosity') {
      //   getCuriosityPhotos().map((photo) => console.log(photo.img_src));
      getCuriosityPhotos();
    }
    if (e.target.value === 'Opportunity') {
      getOpportunityPhotos();
    }
    if (e.target.value === 'Spirit') {
      getSpiritPhotos();
    }
  };
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const roverNames = ['Curiosity', 'Opportunity', 'Spirit'];

// create content
const App = (state) => {
  let { rovers, apod } = state;

  return `
        <header></header>
        <main>
            ${RoverSelect(roverNames)}
            <section>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

const RoverSelect = (roverNames) => {
  return `<select id="RoverSelect">${roverNames.map((rover) =>
    RoverOption(rover)
  )}</select>`;
};

const RoverOption = (rover) => {
  const isSelected = rover === store.rovers.selected;
  return `<option ${
    isSelected ? 'selected' : ''
  } value=${rover}>${rover}</option>`;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));

  return data;
};

const getCuriosityPhotos = () => {
  fetch('http://localhost:3000/curiosity')
    .then((res) => res.json())
    .then((curiosity) =>
      updateStore(store, {
        ...store,
        rovers: {
          ...store.rovers,
          selected: 'Curiosity',
          curiosity: curiosity.photos.photos,
        },
      })
    );
};

const getOpportunityPhotos = () => {
  fetch('http://localhost:3000/opportunity')
    .then((res) => res.json())
    .then((opportunity) =>
      updateStore(store, {
        ...store,
        rovers: {
          ...store.rovers,
          selected: 'Opportunity',
          opportunity: opportunity.photos.photos,
        },
      })
    );
};

const getSpiritPhotos = () => {
  fetch('http://localhost:3000/spirit')
    .then((res) => res.json())
    .then((spirit) =>
      updateStore(store, {
        ...store,
        rovers: {
          ...store.rovers,
          selected: 'Spirit',
          spirit: spirit.photos.photos,
        },
      })
    );
};
