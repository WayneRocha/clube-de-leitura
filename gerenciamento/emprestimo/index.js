(async () => {
    const db = new Database();
    const parent = document.querySelector('#user-list');

    const fillList = async loans => {
        for (const loan of loans){
            const friend = await db.getDocument('amiguinho', loan.amiguinho);
            const magazine = await db.getDocument('revista', loan.revistas.revista);
            const loanDate = new Date(loan.revistas.data_emprestimo).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const loanReturnDate = new Date(loan.revistas.data_devolucao).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const row = `
            <li class="list--list-item" data-loan-id="${loan.id}">
                <h3 class="name">${friend.nome_amiguinho}</h3>
                <p class="born">Revista: ${magazine.nome}</p>
                <p class="address">Entregue em ${loanDate}</p>
                <p class="address">Ser devolvido em ${loanReturnDate}</p>
            </li>
            `;
            parent.innerHTML += row;
        }
    };
    const loansArray = await db.getLoansArray();
    fillList(loansArray);
})();