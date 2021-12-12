const db = new Database();
const colorMap = {
    1: {
        hex:'FFC759',
        label: 'amarelo'
    },
    2: {
        hex:'FF7B9C',
        label: 'salmão'
    },
    3: {
        hex:'607196',
        label: 'cinza'
    },
    4: {
        hex:'BABFD1',
        label: 'cinza bègue'
    },
    5: {
        hex:'E8E9ED',
        label: 'branco areia'
    }
};

let confirmDeleteRequest;
let confirmEditionRequest;

function addDeletionRequest(element) {
    confirmDeleteRequest = element.getAttribute('data-box-id');
}

function fillList(box){
    const parent = document.querySelector('#box-list');
    parent.innerHTML = '';
    box.forEach(box => {
        const row = `
        <li class="list--list-item d-flex align-items-center justify-content-between">
            <a class="name" id="botao" href="details.html#${box.id}">Caixa ${box.numero}</a>
            <div>
            <i onclick="addDeletionRequest(this)" class="mx-4 bx bxs-trash delete-box" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-box-id="${box.id}"></i>
            <i class="mx-4 bx bxs-edit-alt" data-box-id="${box.id}" data-bs-toggle="modal" data-bs-target="#edition-modal"></i>
            </div>
        </li>
        `;
        parent.innerHTML += row;
    });
}
async function updateBox(){
    const selectElement = document.getElementById('cor');
    const color = colorMap[selectElement.value].hex;
    const tags = document.getElementById('etiquetas').value.split(',');
    const number = document.getElementById('numero').value;

    const boxRefId = await db.update_box(confirmEditionRequest, color, tags);
    
    selectElement.value = "";
    color.value = "";
    tags.value = "";
    number.value = "";

    showSwal(((boxRefId) ? 'success-message' : 'error-message'), 'Informações Alteradas!');
}
function fillBoxEditionModal(boxData){
    Object.entries(colorMap).forEach((color, index) => {
        document.getElementById('cor').innerHTML += `<option value="${index + 1}">${color[1].label}</option>`;
    });
    document.querySelector('#etiquetas').value = boxData.etiquetas.join(', ');
    document.querySelector('#numero').value = boxData.numero;
}

(async () => {
    const boxArray = await db.getBoxArray();
    const editionModal = document.getElementById('edition-modal');
    const confirmEditionBtn = document.getElementById('confirm-edition');
    fillList(boxArray);
    document.getElementById('confirm-delete').addEventListener('click', () => {
        db.deleteBox(confirmDeleteRequest)
            .then(async () => {
                const boxArray = await db.getBoxArray();
                fillList(boxArray);
                showSwal('success-message', 'Caixa Deletada!');
            })
            .catch(showSwal())
    });
    editionModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        const boxId = button.getAttribute('data-box-id');
        const boxData = await db.getDocument('caixa', boxId);
        fillBoxEditionModal(boxData);
        confirmEditionRequest = boxId;
    });
    confirmEditionBtn.addEventListener('click', () => {
        updateBox();
    });
})();