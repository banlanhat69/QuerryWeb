let query = '';
let finalResult;

function getQueryInformation(buttonClass) {
  if (buttonClass === 'button-text-search') {
    return document.getElementById('text_search').value;
  }
  if (buttonClass === 'button-id-search') {
    return document.getElementById('id_search').value;
  }
  if (buttonClass === 'button-neighbor-search') {
    return document.getElementById('neighbor').value;
  }
  if (buttonClass === 'button-ocr-search') {
    return document.getElementById('ocr').value;
  }
  return null;
}

function zoomImage(img) {
  let status = document.getElementById('status');
  status.innerHTML = 
  `
  <div class='status-img'>
    <img class='bigsize-img' src='${img}' draggable='false'>
  </div>
  `;
  status.addEventListener('click', () => {
    if(status.innerHTML !== null) {
      status.innerHTML = null
    }
  })
}

function toggleMenu(index) {
  let subMenu = document.getElementById(`subMenu${index}`);
  subMenu.classList.toggle('open-menu')
}

function subIdQuery(idQuery) {
  const query_now = idQuery;
  if (query_now === '' || query_now === query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'Id - ' + query;
    fetch(`id_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
}

function subNeighborQuery(idQuery) {
  const query_now = idQuery;
  if (query_now === '' || query_now === query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'Neighbor - ' + query;
    fetch(`neighbor_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
}

function printImage(data) {
  let res = [];
  const resultContainer = document.querySelector('.images-result');
  if (resultContainer.innerHTML !== null) {
    resultContainer.innerHTML = null;
  }
  data.forEach((value, index) => {
    const path = value[1];
    const info_res = path.split('/');
    const video_id = info_res[info_res.length - 2];
    let frame = info_res[info_res.length - 1];
    frame = frame.slice(0, frame.length - 4);
    resultContainer.innerHTML += 
    `
    <div class='image-container'>
      <img class='image-result' src='${path}' draggable='false'>
      <p class='information-result'>${video_id} - ${frame} - id: ${value[0]}</p>
      <div class='menu-option'>
        <button class='button-option button-option-${index}' onclick='toggleMenu(${index})'>
          <img class='menu-img' src='static/image/icons-menu.png'>
        </button>
        <button class='scale-button scale-button-${index}' onclick='zoomImage("${path}")'>
          <img class='scale-img' src='static/image/icons-zoom-out.png'>
        </button>
        <div class='sub-menu-wrap sub-menu-wrap-${index}' id='subMenu${index}'>
          <div class='sub-menu'>
            <button class='sub-option sub-menu-id sub-menu-id-${index}' onclick='subIdQuery(${value[0]})'> 
              Id Search 
            </button>
            <button class='sub-option sub-menu-neighbor sub-menu-neighbor-${index}' onclick='subNeighborQuery(${value[0]})'>
              Neighbor Search
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    const buttonSubIDSearching = document.querySelector(`.sub-menu-id-${index}`);
    buttonSubIDSearching.addEventListener('click', () => {
      const query_now = value[0];
      if (query_now === '' || query_now === query){
        alert('Không thành công');
      }
      else {
        query = query_now;
        let informationSearching = document.querySelector('.query-information');
        informationSearching.innerHTML = 'Id - ' + query;
        fetch(`id_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: query })
        })
        .then(response => response.json())
        .then(data => {
          finalResult = printImage(data);
        });
      }
    });
    res.push([video_id, frame]);
    });
  return res;
}

const buttonTextSearching = document.querySelector('.button-text-search');
buttonTextSearching.addEventListener('click', () => {
  const query_now = getQueryInformation(buttonTextSearching.classList[1]);
  if (query_now === '' || query_now == query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'Text - ' + query;
    fetch(`/${buttonTextSearching.getAttribute('name')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
});

const inputTextSearching = document.querySelector('.input-text-search');
inputTextSearching.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query_now = inputTextSearching.value;
    if (query_now === '' || query_now == query){
      alert('Không thành công');
    }
    else {
      query = query_now;
      let informationSearching = document.querySelector('.query-information');
      informationSearching.innerHTML = 'Text - ' + query;
      fetch(`/text_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: query })
      })
      .then(response => response.json())
      .then(data => {
        finalResult = printImage(data);
      });
    }
  }
});

const buttonIDSearching = document.querySelector('.button-id-search');
buttonIDSearching.addEventListener('click', () => {
  const query_now = getQueryInformation(buttonIDSearching.classList[1]);
  if (query_now === '' || query_now == query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'Id - ' + query;
    fetch(`/${buttonIDSearching.getAttribute('name')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
});

const inputIdSearching = document.querySelector('.input-id-search');
inputIdSearching.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query_now = inputIdSearching.value;
    if (query_now === '' || query_now == query){
      alert('Không thành công');
    }
    else {
      query = query_now;
      let informationSearching = document.querySelector('.query-information');
      informationSearching.innerHTML = 'Id - ' + query;
      fetch(`/id_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: query })
      })
      .then(response => response.json())
      .then(data => {
        finalResult = printImage(data);
      });
    }
  }
});

const buttonNeighborSearching = document.querySelector('.button-neighbor-search');
buttonNeighborSearching.addEventListener('click', () => {
  const query_now = getQueryInformation(buttonNeighborSearching.classList[1]);
  if (query_now === '' || query_now == query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'Neighbor - ' + query;
    fetch(`/${buttonNeighborSearching.getAttribute('name')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
});

const inputNeighborSearching = document.querySelector('.input-neighbor-search');
inputNeighborSearching.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query_now = inputNeighborSearching.value;
    if (query_now === '' || query_now == query){
      alert('Không thành công');
    }
    else {
      query = query_now;
      let informationSearching = document.querySelector('.query-information');
      informationSearching.innerHTML = 'Neighbor - ' + query;
      fetch(`/neighbor_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: query })
      })
      .then(response => response.json())
      .then(data => {
        finalResult = printImage(data);
      });
    }
  }
});


const buttonOCRSearching = document.querySelector('.button-ocr-search');
buttonOCRSearching.addEventListener('click', () => {
  const query_now = getQueryInformation(buttonOCRSearching.classList[1]);
  if (query_now === '' || query_now == query){
    alert('Không thành công');
  }
  else {
    query = query_now;
    let informationSearching = document.querySelector('.query-information');
    informationSearching.innerHTML = 'OCR - ' + query;
    fetch(`/${buttonOCRSearching.getAttribute('name')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: query })
    })
    .then(response => response.json())
    .then(data => {
      finalResult = printImage(data);
    });
  }
});

const inputOCRSearching = document.querySelector('.input-ocr-search');
inputOCRSearching.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const query_now = inputOCRSearching.value;
    if (query_now === '' || query_now == query){
      alert('Không thành công');
    }
    else {
      query = query_now;
      let informationSearching = document.querySelector('.query-information');
      informationSearching.innerHTML = 'OCR - ' + query;
      fetch(`/ocr_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: query })
      })
      .then(response => response.json())
      .then(data => {
        finalResult = printImage(data);
      });
    }
  }
});


const submitSaveCSV = document.querySelector('.submit-save');
submitSaveCSV.addEventListener('click', () => {
  const fileName = document.getElementById('csv');
  if (fileName.value === null) {
    alert('Không hợp lệ');
  }
  else {
    console.log(finalResult)
    fetch(`save_csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: [fileName.value, finalResult] })
    })
    .then(response => response.json())
    .then(data => {
      if (data['status'] === 'success') {
        alert('Thành công');
      }
    });
  }
});

const inputCSVName = document.getElementById('csv');
inputCSVName.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const fileName = document.getElementById('csv');
    if (fileName.value === null) {
      alert('Không hợp lệ');
    }
    else {
      fetch(`save_csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [fileName.value, finalResult] })
      })
      .then(response => response.json())
      .then(data => {
        if (data['status'] === 'success') {
          alert('Thành công');
        }
      });
    }
  }
});