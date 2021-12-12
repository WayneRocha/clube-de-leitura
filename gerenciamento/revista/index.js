const db = new Database();
let confirmDeleteRequest;
let confirmEditionRequest;

function addDeletionRequest(element) {
    confirmDeleteRequest = element.getAttribute('data-magazine-id');
}

function fillList(magazine){
    const parent = document.querySelector('#magazine-list');
    parent.innerHTML = '';
    magazine.forEach(magazine => {
        const row = `
        <li class="list--list-item d-flex align-items-center justify-content-between">
            <div>
                <h3 class="name">${magazine.nome}</h3>
                <p class="born">Categoria: ${magazine.categoria}</p>
                <p class="address">Coleção: ${magazine.numero_colecao}</p>
                <p class="address">Caixa ${magazine.caixa}</p>
            </div>
            <div>
                <i onclick="addDeletionRequest(this)" class="mx-4 bx bxs-trash delete-box" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-magazine-id="${magazine.id}"></i>
                <i class="mx-4 bx bxs-edit-alt" data-magazine-id="${magazine.id}" data-bs-toggle="modal" data-bs-target="#edition-modal"></i>
            </div>
        </li>
        `;
        parent.innerHTML += row;
    });
}
async function updateMagazine(){
    const name = document.getElementById('nome').value;
    const collectionNumber = document.getElementById('numero-colecao').value;
    const type = document.getElementById('senioridade').value;

    const magazineRefId = await db.update_magazine(confirmEditionRequest, name, collectionNumber, type);
    
    name.value = "";
    collectionNumber.value = "";
    type.value = "";

    showSwal((magazineRefId) ? 'success-message' : 'error-message', 'Informações Alteradas!');
    
}
function fillMagazineEditionModal(magazineData){
    document.getElementById('nome').value = magazineData.nome;
    document.getElementById('numero-colecao').value = magazineData.numero_colecao;
    document.getElementById('senioridade').value = magazineData.categoria;
}

(async () => {
    const magazinesArray = await db.getMagazinesArray();
    const editionModal = document.getElementById('edition-modal');
    const confirmEditionBtn = document.getElementById('confirm-edition');
    fillList(magazinesArray);
    document.getElementById('confirm-delete').addEventListener('click', () => {
        db.deleteMagazine(confirmDeleteRequest)
            .then(async () => {
                const magazinesArray = await db.getMagazinesArray();
                fillList(magazinesArray);
                showSwal('success-message', 'Revista Deletada!');
            })
            .catch(showSwal())
    });
    editionModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        const magazineId = button.getAttribute('data-magazine-id');
        const magazineData = await db.getDocument('revista', magazineId);
        fillMagazineEditionModal(magazineData);
        confirmEditionRequest = magazineId;
    });
    confirmEditionBtn.addEventListener('click', async () => {
        updateMagazine();
        const magazinesArray = await db.getMagazinesArray();
        fillList(magazinesArray);
        showSwal('success-message');
    });
})();