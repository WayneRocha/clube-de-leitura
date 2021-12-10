(async () => {
    const db = new Database();
    const fillList = box => {
        const parent = document.querySelector('#box-list');
        box.forEach(box => {
            const row = `
            <li class="list--list-item" data-box-id="${box.id}">
              <a class="name" id="botao" href="details.html#${box.id}">Caixa ${box.numero}</a>
            </li>
            `;
            parent.innerHTML += row;
        });
    }
    const boxArray = await db.getBoxArray();
    fillList(boxArray);
})();