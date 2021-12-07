(() => {

    document.getElementById('botao').addEventListener('click', () => {
        const colorMap = {
            1: 'FFC759',
            2: 'FF7B9C',
            3: '607196',
            4: 'BABFD1',
            5: 'E8E9ED'
        };
        const color = colorMap[document.getElementById('cor').value] || 3;
        const tags = document.getElementById('etiquetas').value.split(',');
        const number = document.getElementById('numero').value;
        const db = new Database();

        db.register_box(color, tags, number);
    });
})();