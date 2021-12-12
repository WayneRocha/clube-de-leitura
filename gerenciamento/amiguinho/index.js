const db = new Database();
let confirmDeleteRequest;
let confirmEditionRequest;

function addDeletionRequest(element) {
    confirmDeleteRequest = element.getAttribute('data-friend-id');
}

function fillList(friend){
    const parent = document.querySelector('#user-list');
    parent.innerHTML = '';
    friend.forEach(friend => {
        const row = `
        <li class="list--list-item d-flex align-items-center justify-content-between">
            <div>
                <h3 class="name">${friend.nome_amiguinho}</h3>
                <p class="born">mãe: ${friend.nome_mae}</p>
                <p class="address">${friend.telefone_mae}</p>
            </div>
            <div>
                <i onclick="addDeletionRequest(this)" class="mx-4 bx bxs-trash delete-box" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-friend-id="${friend.id}"></i>
                <i class="mx-4 bx bxs-edit-alt" data-friend-id="${friend.id}" data-bs-toggle="modal" data-bs-target="#edition-modal"></i>
            </div>
        </li>
        `;
        parent.innerHTML += row;
    });
}
async function updateFriend(){
    const name = document.getElementById('nome').value;
    const motherName = document.getElementById('nome-mae').value;
    const motherPhone = document.getElementById('telefone-mae').value;
    const address = document.getElementById('endereco').value;
    const birthday = (() => {
        const age = document.getElementById('idade').value;
        return new Date().getFullYear() - age;
    })();

    const friendDocId = await db.update_friend(confirmEditionRequest, name, motherName, motherPhone, address, birthday);
    
    name.value = "";
    motherName.value = "";
    motherPhone.value = "";
    address.value = "";
    birthday.value = "";

    showSwal((friendDocId) ? 'success-message' : 'error-message', 'Informações alteradas!');
    
}
function fillFriendEditionModal(friendData){
    document.getElementById('nome').value = friendData.nome_amiguinho
    document.getElementById('nome-mae').value = friendData.nome_mae
    document.getElementById('telefone-mae').value = friendData.telefone_mae
    document.getElementById('endereco').value = friendData.endereco
    document.getElementById('idade').value = (() => {
        return (new Date().getFullYear()) - friendData.aniversario_amiguinho;
    })();
}

(async () => {
    const friendsArray = await db.getFriendsArray();
    const editionModal = document.getElementById('edition-modal');
    const confirmEditionBtn = document.getElementById('confirm-edition');
    fillList(friendsArray);
    document.getElementById('confirm-delete').addEventListener('click', () => {
        db.deleteFriend(confirmDeleteRequest)
            .then(async () => {
                const friendsArray = await db.getFriendsArray();
                fillList(friendsArray);
                showSwal('success-message', 'Amiguinho Deletado!');
            })
            .catch(showSwal())
    });
    editionModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        const friendId = button.getAttribute('data-friend-id');
        const friendData = await db.getDocument('amiguinho', friendId);
        fillFriendEditionModal(friendData);
        confirmEditionRequest = friendId;
    });
    confirmEditionBtn.addEventListener('click', async () => {
        updateFriend();
        const friendsArray = await db.getFriendsArray();
        fillList(friendsArray);
        showSwal('success-message');
    });
})();