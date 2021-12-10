(() => {

    document.getElementById('botao').addEventListener('click', () => {
        const name = document.getElementById('nome').value;
        const motherName = document.getElementById('nome-mae').value;
        const motherPhone = document.getElementById('telefone-mae').value;
        const address = document.getElementById('endereco').value;
        const birthday = (() => {
            const age = document.getElementById('idade').value;
            return new Date().getFullYear() - age;
        })();
        const db = new Database();
    
        db.register_friend(name, motherName, motherPhone, address, birthday);
        
        name.value = "";
        motherName.value = "";
        motherPhone.value = "";
        address.value = "";
        birthday.value = "";

        showSwal('success-message');
        
    });
})();