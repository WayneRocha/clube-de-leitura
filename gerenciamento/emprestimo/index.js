const db = new Database();
let confirmDeleteRequest;
let confirmEditionRequest;

function addDeletionRequest(element) {
    confirmDeleteRequest = element.getAttribute('data-loan-id');
}

async function fillList(loans){
    const parent = document.querySelector('#user-list');
    parent.innerHTML = '';
    for (const loan of loans){
        const friend = await db.getDocument('amiguinho', loan.amiguinho);
        const magazine = await db.getDocument('revista', loan.revistas.revista);
        const loanDate = new Date(loan.revistas.data_emprestimo).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        const loanReturnDate = new Date(loan.revistas.data_devolucao).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        const row = `
            <li class="list--list-item d-flex align-items-center justify-content-between">
                <div>
                    <h3 class="name">${friend.nome_amiguinho}</h3>
                    <p class="born">Categoria: ${magazine.nome}</p>
                    <p class="address">Entregue em ${loanDate}</p>
                    <p class="address">Ser devolvido em ${loanReturnDate}</p>
                </div>
                <div>
                    <i onclick="addDeletionRequest(this)" class="mx-4 bx bxs-trash delete-box" type="button" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" data-loan-id="${loan.id}"></i>
                    <i class="mx-4 bx bxs-edit-alt" data-loan-id="${loan.id}" data-bs-toggle="modal" data-bs-target="#edition-modal"></i>
                </div>
            </li>
        `;
        parent.innerHTML += row;
    }
}
async function updateLoan(){
    const friendId = document.getElementById('amiguinho').value;
    const magazineId = document.getElementById('revista').value;
    const loanDate = (() => {
        const elValue = document.getElementById('data-emprestimo').value;
        return new Date(elValue).getTime();
    })();
    const returnDate = (() => {
        const elValue = document.getElementById('data-devolucao').value;
        return new Date(elValue).getTime();
    })();

    const loanRefId = await db.update_loan(confirmEditionRequest, friendId, magazineId, loanDate, returnDate);

    showSwal((loanRefId) ? 'success-message' : 'error-message', 'Informações Alteradas!');
    
}
async function fillLoanEditionModal(loanData){
    const friends = await db.getFriendsArray();
    const magazines = await db.getMagazinesArray();
    const loanDate = new Date(loanData.revistas.data_emprestimo).toISOString().slice(0,10);
    const loanReturnDate = new Date(loanData.revistas.data_devolucao).toISOString().slice(0,10);
    const friendsSelectElement = document.getElementById('amiguinho');
    const magazinesSelectElement = document.getElementById('revista');

    friends.forEach(friend => {
        const option = `<option value="${friend.id}">${friend.nome_amiguinho}</option>`;
        friendsSelectElement.innerHTML += option;
    });

    magazines.forEach(magazine => {
        const option = `<option value="${magazine.id}">${magazine.nome}</option>`;
        magazinesSelectElement.innerHTML += option;
    });
    
    document.getElementById('amiguinho').value = loanData.amiguinho;
    document.getElementById('revista').value = loanData.revistas.revista;
    document.getElementById('data-emprestimo').value = loanDate;
    document.getElementById('data-devolucao').value = loanReturnDate;


}

(async () => {
    const loansArray = await db.getLoansArray();
    const editionModal = document.getElementById('edition-modal');
    const confirmEditionBtn = document.getElementById('confirm-edition');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    fillList(loansArray);
    confirmDeleteBtn.addEventListener('click', () => {
        db.deleteLoan(confirmDeleteRequest)
            .then(async () => {
                const loansArray = await db.getLoansArray();
                fillList(loansArray);
                showSwal('success-message', 'Emprestimo Deletado!');
            })
            .catch(showSwal())
    });
    editionModal.addEventListener('show.bs.modal', async (event) => {
        const button = event.relatedTarget;
        const loanId = button.getAttribute('data-loan-id');
        const loanData = await db.getDocument('emprestimos', loanId);
        fillLoanEditionModal(loanData);
        confirmEditionRequest = loanId;
    });
    confirmEditionBtn.addEventListener('click', async () => {
        updateLoan();
        const loansArray = await db.getLoansArray();
        fillList(loansArray);
        showSwal('success-message');
    });
})();
