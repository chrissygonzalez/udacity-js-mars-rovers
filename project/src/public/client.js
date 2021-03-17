let store = {
  rovers: {
    roverNames: ['Curiosity', 'Opportunity', 'Spirit'],
    selected: '',
    curiosity: {},
    opportunity: {},
    spirit: {},
  },
  manifests: {
    curiosity: null,
    opportunity: null,
    spirit: null,
  },
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
  initMenu();
  //   debugger;
};

const initMenu = () => {
  const roverMenu = document.getElementById('RoverSelect');
  roverMenu.onchange = (e) => menuActions(e);
};

const menuActions = (e) => {
  if (e.target.value === 'Curiosity') {
    getCuriosityPhotos();
    getCuriosityManifest();
  }
  if (e.target.value === 'Opportunity') {
    getOpportunityPhotos();
    getOpportunityManifest();
  }
  if (e.target.value === 'Spirit') {
    getSpiritPhotos();
    getSpiritManifest();
  }
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  const { rovers, manifests } = state;
  const currentRover = getCurrentRover(rovers, manifests);

  return `
        <header></header>
        <main>
            ${RoverSelect(rovers.roverNames)}
            <section>
                <h1>${currentRover.name}</h1>
                <h3>Status: ${currentRover.status}</h3>
                <h3>Launch date: ${currentRover.launch}</h3>
                <h3>Landing date: ${currentRover.landing}</h3>
                ${currentRover.photos.map((photo) => RoverImage(photo.img_src))}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
  initMenu();
});

const RoverSelect = (roverNames) => {
  return `<select id="RoverSelect"><option value="">Choose a rover</option>${roverNames.map(
    (rover) => RoverOption(rover)
  )}</select>`;
};

const RoverOption = (rover) => {
  const isSelected = rover === store.rovers.selected;
  return `<option ${
    isSelected ? 'selected' : ''
  } value=${rover}>${rover}</option>`;
};

const RoverImage = (url) => {
  return `<img src=${url} />`;
};

const getCurrentRover = (rovers, manifests) => {
  if (rovers.selected && manifests[rovers.selected.toLowerCase()]) {
    // debugger;
    const current = rovers.selected;
    const manifest = manifests[current.toLowerCase()].manifest.photo_manifest;
    // debugger;
    return {
      name: current,
      photos: rovers[current.toLowerCase()],
      manifest,
      launch: manifest.launch_date,
      landing: manifest.landing_date,
      status: manifest.status,
    };
  } else {
    return {
      name: '',
      photos: [],
      manifest: {},
      launch: '',
      landing: '',
      status: '',
    };
  }
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

const getCuriosityManifest = () => {
  fetch('http://localhost:3000/curiosity/manifest')
    .then((res) => res.json())
    .then((manifest) =>
      updateStore(store, {
        ...store,
        manifests: {
          ...store.manifests,
          curiosity: manifest,
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

const getOpportunityManifest = () => {
  fetch('http://localhost:3000/opportunity/manifest')
    .then((res) => res.json())
    .then((manifest) =>
      updateStore(store, {
        ...store,
        manifests: {
          ...store.manifests,
          opportunity: manifest,
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

const getSpiritManifest = () => {
  fetch('http://localhost:3000/spirit/manifest')
    .then((res) => res.json())
    .then((manifest) =>
      updateStore(store, {
        ...store,
        manifests: {
          ...store.manifests,
          spirit: manifest,
        },
      })
    );
};
