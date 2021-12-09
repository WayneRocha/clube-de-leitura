(() => {
    const db = new Database();
    const fillList = loans => {
        const parent = document.querySelector('#user-list');
        loans.forEach(loan => {
            db.getDocument('amiguinho', loan.amiguinho)
            .then(friendData => {
                const loanDate = new Date(loan.data_emprestimo).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
                const loanReturnDate = new Date(loan.data_devolucao).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
                const row = `
                <li class="list--list-item" data-loan-id="${loan.id}">
                    <h3 class="name">${friendData.nome_amiguinho}</h3>
                    <p class="born">mãe: ${friendData.nome_mae}</p>
                    <p class="address">${friendData.telefone_mae}</p>
                    <p class="address">Entregue em ${loanDate}</p>
                    <p class="address">Ser devolvido em ${loanReturnDate}</p>
                </li>
                `;
                parent.innerHTML += row;
            });
        });
    }
    db.getLoansArray().then(loansArray => {
        fillList(loansArray);
    });
})();