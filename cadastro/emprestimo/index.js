(() => {

    document.getElementById('botao').addEventListener('click', () => {
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
        const db = new Database();

        db.register_loan("P0j2kbDe2ZHZ9ZFfnARd", "ndgH0n4Vim0fLeHejgCM", loanDate, returnDate);
    });
})();