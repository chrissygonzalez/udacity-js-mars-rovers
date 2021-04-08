let store = Immutable.fromJS({
  showDefault: true,
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
};

const handleChange = (e) => {
  updateStore(store, {
    showDefault: false,
    selectedRover: e.value,
    photos: [],
    manifest: {},
  });
  menuActions(e)()();
};

const menuActions = (e) => () => getRoverManifestAndPhotos(e.value);
// const menuActions = (e) => {
//   if (e.value === 'curiosity') {
//     getRoverManifestAndPhotos('curiosity')();
//   }
//   if (e.value === 'opportunity') {
//     getRoverManifestAndPhotos('opportunity')();
//   }
//   if (e.value === 'spirit') {
//     getRoverManifestAndPhotos('spirit')();
//   }
// };

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  const rover = getRoverData(state);
  const showDefault = state.get('showDefault');

  return `
        <header>
            ${RoverSelect(state.get('roverNames'))}
        </header>
        <main>
            ${DefaultText(showDefault)}
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
});

// COMPONENTS -------------------

const RoverSelect = (roverNames) => {
  return `<select id="RoverSelect" onchange="handleChange(this)"><option value="">Choose a rover</option>${roverNames.map(
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
    const statusStyle = rover.status === 'active' ? 'active' : 'completed';
    return `<p><span class="label">Status</span>: <span class=${statusStyle}>${rover.status}</span></p>
        <p><span class="label">Launch date:</span> ${rover.launch}</p>
        <p><span class="label">Landing date:</span> ${rover.landing}</p>
        <p><span class="label">Total photos taken:</span> ${rover.totalPhotos}</p>
        <p><span class="label">Most recent photos taken:</span> ${rover.maxDate} / Martian sol ${rover.maxSol}</p>
        <h3>Photos taken on Martian sol ${rover.maxSol}</h3>`;
  }
  return '';
};

const RoverImage = (url) => {
  return `<img class="rover-image" src=${url} alt="photo of Mars" />`;
};

const DefaultText = (showDefault) => {
  if (showDefault) {
    return `<ol><h3>The scientific objectives of the Mars Exploration Rover mission are to:</h3>
    <li>Search for and characterize a variety of rocks and soils that hold clues to past water activity. In particular, samples sought will include those that have minerals deposited by water-related processes such as precipitation, evaporation, sedimentary cementation, or hydrothermal activity.</li>
    <li>Determine the distribution and composition of minerals, rocks, and soils surrounding the landing sites.</li>
    <li>Determine what geologic processes have shaped the local terrain and influenced the chemistry. Such processes could include water or wind erosion, sedimentation, hydrothermal mechanisms, volcanism, and cratering.</li>
    <li>Perform "ground truth" -- calibration and validation -- of surface observations made by Mars orbiter instruments. This will help determine the accuracy and effectiveness of various instruments that survey Martian geology from orbit.</li>
    <li>Search for iron-containing minerals, identify and quantify relative amounts of specific mineral types that contain water or were formed in water, such as iron-bearing carbonates.</li>
    <li>Characterize the mineralogy and textures of rocks and soils and determine the processes that created them.</li>
    <li>Search for geological clues to the environmental conditions that existed when liquid water was present. Assess whether those environments were conducive to life.</li>
    <p class="caption">From <a href="https://mars.nasa.gov/mer/mission/science/objectives/" target="_blank" rel="noopener noreferrer">Mars Exploration Rover Mission Science Objectives</a></p>
    </ol>`;
  } else {
    return '';
  }
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

// API REQUESTS -----------------------

const getRoverManifestAndPhotos = (rover) => {
  return () => {
    fetch(`http://localhost:3000/manifest/${rover}`)
      .then((res) => res.json())
      .then((manifest) => {
        updateStore(store, { manifest });
        const maxSol = manifest.manifest.photo_manifest.max_sol;
        return fetch(`http://localhost:3000/photos/${rover}/${maxSol}`);
      })
      .then((res) => res.json())
      .then((data) => {
        updateStore(store, {
          selectedRover: rover,
          photos: data.photos.photos,
        });
      });
  };
};
