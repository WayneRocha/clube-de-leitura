(async () => {
    const db = new Database();
    const fillList = magazineArray => {
        const parent = document.querySelector('#magazines-list');
        magazineArray.forEach(magazine => {
            const row = `
            <li class="list--list-item" data-magazine-id="${magazine.id}">
                <h3 class="name">${magazine.nome}</h3>
                <p class="born">Categoria: ${magazine.categoria}</p>
                <p class="address">Coleção ${magazine.numero_colecao}</p>
            </li> 
            `;
            parent.innerHTML += row;
        });
    }
    const magazineArray = await db.getMagazinesArray();
    fillList(magazineArray);
})();