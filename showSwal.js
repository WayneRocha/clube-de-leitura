function showSwal(type, title) {
    'use strict';
    if (type === 'success-message') {
        swal({
            title: title,
            type: 'success',
            button: {
                text: "Ok",
                value: true,
                visible: true,
                className: "btn btn-primary"
            }
        })
    } else {
        swal("Algo errado aconteceu");
    }
}