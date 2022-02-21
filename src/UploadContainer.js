export default function UploadContainer({ $target, initialState, onChange }) {
  const $uploadContainer = document.createElement('section');
  $target.appendChild($uploadContainer);
  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $uploadContainer.innerHTML = `
      <label id="input-label" for="input-file">
        Upload JSON
      </label>
      <input type="file" id="input-file" accept=".json" style="display:none;">
    `;
  };

  this.render();

  $uploadContainer.addEventListener('change', (e) => {
    const { files } = e.target;
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      onChange(makeObject(JSON.parse(fileReader.result)));
    };
  });
}

// .으로 표현된 계층관계를 obj으로 바꾸는 함수
function makeObject(fileObj) {
  const jsonObj = {};
  for (const [key, value] of Object.entries(fileObj)) {
    const split_list = key.split('.');
    let temp = jsonObj;
    for (const [index, property] of split_list.entries()) {
      if (index === split_list.length - 1) {
        temp[property] = {
          value,
          isClosed: true
        };
      } else {
        if (!temp[property]) {
          temp[property] = {
            isClosed: true
          };
        }
        temp = temp[property];
      }
    }
  }
  return jsonObj;
}
