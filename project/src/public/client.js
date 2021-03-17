let store = {
  rovers: {
    roverNames: ['Curiosity', 'Opportunity', 'Spirit'],
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
  }
  if (e.target.value === 'Opportunity') {
    getOpportunityPhotos();
  }
  if (e.target.value === 'Spirit') {
    getSpiritPhotos();
  }
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let { rovers } = state;

  return `
        <header></header>
        <main>
            ${RoverSelect(rovers.roverNames)}
            <section>
                ${rovers.selected}
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
