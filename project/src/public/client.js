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
        <header>
            ${RoverSelect(rovers.roverNames)}
        </header>
        <main>
            <section class="rover-details">
                ${RoverDetails(currentRover)}
            </section>
            <section class="flex rover-photos">
                ${currentRover.photos.reduce(
                  (acc, curr) => acc + RoverImage(curr.img_src),
                  ''
                )}
            </section>
        </main>
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

const RoverDetails = (rover) => {
  if (rover.name) {
    return `<p><span class="label">Status</span>: ${rover.status}</p>
        <p><span class="label">Launch date:</span> ${rover.launch}</p>
        <p><span class="label">Landing date:</span> ${rover.landing}</p>
        <p><span class="label">Total photos taken:</span> ${rover.totalPhotos}</p>
        <p><span class="label">Most recent photos taken:</span> ${rover.maxDate} / Martian sol ${rover.maxSol}</p>`;
  }
  return '';
};

const RoverImage = (url) => {
  return `<img class="rover-image" src=${url} alt="photo of Mars" />`;
};

// HELPER FUNCTIONS -------------------

const getCurrentRover = (rovers, manifests) => {
  if (rovers.selected && manifests[rovers.selected.toLowerCase()]) {
    const current = rovers.selected;
    const manifest = manifests[current.toLowerCase()].manifest.photo_manifest;
    return {
      name: current,
      photos: rovers[current.toLowerCase()],
      manifest,
      launch: getFormattedDate(manifest.launch_date),
      landing: getFormattedDate(manifest.landing_date),
      status: manifest.status,
      maxSol: manifest.max_sol,
      maxDate: getFormattedDate(manifest.max_date),
      totalPhotos: manifest.total_photos,
    };
  } else {
    return {
      name: '',
      photos: [],
      manifest: {},
      launch: '',
      landing: '',
      status: '',
      maxSol: '',
      maxDate: '',
      totalPhotos: '',
    };
  }
};

const getFormattedDate = (date) => {
  return new Date(date).toUTCString().split(' ').slice(0, 4).join(' ');
};

// API REQUESTS -----------------------

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
