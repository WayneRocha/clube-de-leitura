(async () => {
    const db = new Database();
    const titleElement = document.querySelector('#titulo');
    const listElement = document.querySelector('#magazines-list');
    const urlDocID = (() => {
        const uri = new DocumentFragment().baseURI;
        const fragmentIndex = uri.search("#");
        if (fragmentIndex !== -1){
            const urlDocID = uri.slice(fragmentIndex + 1, uri.length);
            return urlDocID;
        }
    })();

    const fillList = async magazinesIds => {
        for (const magazineId of magazinesIds){
            const magazine = await db.getDocument('revista', magazineId);
            console.log(magazine);
            const row = `
            <li class="list--list-item" data-magazine-id="${magazineId}">
                <h3 class="name">${magazine.nome}</h3>
                <p class="born">Categoria: ${magazine.categoria}</p>
                <p class="address">Coleção ${magazine.numero_colecao}</p>
            </li>
            `;
            listElement.innerHTML += row;
        }
    };

    const box = await db.getDocument('caixa', urlDocID);
    const storedMagazinesIdArray = box.revistas_guardadas;
    titleElement.innerHTML = `Caixa ${box.numero}`;
    fillList(storedMagazinesIdArray);
})();