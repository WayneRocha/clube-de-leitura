(async () => {
    const db = new Database();
    const colorMap = {
        1: {
            hex:'FFC759',
            label: 'amarelo'
        },
        2: {
            hex:'FF7B9C',
            label: 'salmão'
        },
        3: {
            hex:'607196',
            label: 'cinza'
        },
        4: {
            hex:'BABFD1',
            label: 'cinza bègue'
        },
        5: {
            hex:'E8E9ED',
            label: 'branco areia'
        }
    };

    document.getElementById('botao').addEventListener('click', async () => {
        const selectElement = document.getElementById('cor');
        const color = colorMap[selectElement.value].hex;
        const tags = document.getElementById('etiquetas').value.split(',');
        const number = document.getElementById('numero').value;
        console.log(color, tags, number);

        const boxRefId = await db.register_box(color, tags, number);
        
        selectElement.value = "";
        color.value = "";
        tags.value = "";
        number.value = "";

        console.log(boxRefId);

        showSwal(((boxRefId != undefined) ? 'success-message' : 'error-message'), 'Caixa Cadastrada!');
        
    });

    Object.entries(colorMap).forEach((color, index) => {
        document.getElementById('cor').innerHTML += `<option value="${index + 1}">${color[1].label}</option>`;
    });
    document.querySelector('#cor > option:nth-child(1)').setAttribute('selected', '');
    db.getNewBoxNumber()
        .then(data => {
            document.querySelector('#numero').value = data;
        })
})();