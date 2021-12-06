(() => {

    document.getElementById('botao').addEventListener('click', () => {
        const name = document.getElementById('nome').value;
        const collectionNumber = document.getElementById('numero-colecao').value;
        const type = document.getElementById('senioridade').value;
        const box = document.getElementById('caixa').value;
        const db = new Database();

        db.register_magazine(name, collectionNumber, type, box);
    });
})();