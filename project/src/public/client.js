let store = Immutable.fromJS({
  roverNames: ['curiosity', 'opportunity', 'spirit'],
  selectedRover: '',
  photos: [],
  manifest: {},
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (state, newState) => {
  store = state.merge(newState);
  render(root, store);
  initMenu();
};

const initMenu = () => {
  const roverMenu = document.getElementById('RoverSelect');
  roverMenu.onchange = (e) => {
    updateStore(store, {
      photos: [],
      manifest: {},
    });
    menuActions(e);
  };
};

const menuActions = (e) => {
  if (e.target.value === 'curiosity') {
    getRoverPhotos('curiosity')();
    getRoverManifest('curiosity')();
  }
  if (e.target.value === 'opportunity') {
    getRoverPhotos('opportunity')();
    getRoverManifest('opportunity')();
  }
  if (e.target.value === 'spirit') {
    getRoverPhotos('spirit')();
    getRoverManifest('spirit')();
  }
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  const rover = getRoverData(state);

  return `
        <header>
            ${RoverSelect(state.get('roverNames'))}
        </header>
        <main>
            <section class="rover-details">
                ${RoverDetails(rover)}
            </section>
            <section class="flex rover-photos">
                ${rover.photos.reduce(
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
  const isSelected = rover === store.get('selectedRover');
  return `<option ${
    isSelected ? 'selected' : ''
  } value=${rover}>${rover.toUpperCase()}</option>`;
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

const getRoverData = (state) => {
  const selected = state.get('selectedRover');
  const hasManifest = state.hasIn(['manifest', 'manifest', 'photo_manifest']);

  if (selected && hasManifest) {
    const manifest = state
      .getIn(['manifest', 'manifest', 'photo_manifest'])
      .toJS();

    return {
      name: selected,
      photos: state.get('photos').toJS(),
      launch: getFormattedDate(manifest.launch_date),
      landing: getFormattedDate(manifest.landing_date),
      status: manifest.status,
      maxSol: manifest.max_sol,
      maxDate: getFormattedDate(manifest.max_date),
      totalPhotos: manifest.total_photos,
    };
  } else {
    return {
      photos: [],
    };
  }
};

const getFormattedDate = (date) => {
  return new Date(date).toUTCString().split(' ').slice(0, 4).join(' ');
};

// TODO: show something before you make a request
// TODO: figure out how to include latest sol date
// API REQUESTS -----------------------
const getRoverPhotos = (rover) => {
  return () => {
    fetch(`http://localhost:3000/${rover}`)
      .then((res) => res.json())
      .then((data) =>
        updateStore(store, {
          selectedRover: rover,
          photos: data.photos.photos,
        })
      );
  };
};

const getRoverManifest = (rover) => {
  return () => {
    fetch(`http://localhost:3000/${rover}/manifest`)
      .then((res) => res.json())
      .then((manifest) => updateStore(store, { manifest }));
  };
};
