(() => {
    const db = new Database();
    const fillList = friends => {
        const parent = document.querySelector('#user-list');
        friends.forEach(friend => {
            const row = `
            <li class="list--list-item" data-friend-id="${friend.id}">
                <h3 class="name">${friend.nome_amiguinho}</h3>
                <p class="born">mãe: ${friend.nome_mae}</p>
                <p class="address">${friend.telefone_mae}</p>
            </li>
            `;
            
            parent.innerHTML += row;
        });
    }
    db.getFriendsArray().then(friendsArray => {
        fillList(friendsArray);
    });
})();