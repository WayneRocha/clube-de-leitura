(async () => {
    const db = new Database();

    document.getElementById('botao').addEventListener('click', async () => {
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

        const loanRefId = await db.register_loan(friendId, magazineId, loanDate, returnDate);

        friendId.value = "";
        magazineId.value = "";
        loanDate.value = "";
        returnDate.value = "";

        showSwal((loanRefId) ? 'success-message' : 'error-message', 'Emprestimo Cadastrado!');
        
    });

    db.getFriendsArray().then(data => {
        const select = document.getElementById('amiguinho');
        data.forEach(friend => {
            const option = `<option value="${friend.id}">${friend.nome_amiguinho}</option>`;
            select.innerHTML += option;
        });
        document.querySelector('#amiguinho > option:nth-child(1)').setAttribute('selected', '');
    });
    db.getMagazinesArray().then(data => {
        const select = document.getElementById('revista');
        data.forEach(magazine => {
            const option = `<option value="${magazine.id}">${magazine.nome}</option>`;
            select.innerHTML += option;
        });
        document.querySelector('#revista > option:nth-child(1)').setAttribute('selected', '');
    });
})();