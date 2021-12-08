class Database {
    constructor(){
        this.db = firebase.firestore();
        this.successFc = () => {};
        this.errorFc = () => {};
    }

    setSuccessFc(callback){
        this.successFc = callback;
    }

    setErrorFc(callback){
        this.errorFc = callback;
    }

    getDocument(collection, docID){
        return new Promise((resolve, reject) => {
            this.db.collection(collection).doc(docID)
                .get()
                .then((querySnapshot) => {
                    const client = querySnapshot.data();
                    console.log("Success to got Document!");
                    this.successFc();
                    resolve(client);
                })
                .catch((error) => {
                    this.errorFc();
                    console.error("Error geting document: ", error);
                });
        }); 
    }

    getAllDocumentsOf(collection){
        return new Promise((resolve, reject) => {
            const docArray = [];
            const orderMap = {
                'amiguinho': 'nome_amiguinho',
                'caixa': 'numero',
                'revista': 'nome',
                'emprestimos': 'revistas'
            }
            this.db.collection(collection).orderBy(orderMap[collection])
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const document = {id: doc.id, ...doc.data()};
                        docArray.push(document);
                    });
                    resolve(docArray);
                })
                .catch((error) => {
                    reject([]);
                });
        });
    }

    getFriendsArray() {
        return this.getAllDocumentsOf('amiguinho');
    }
    
    getMagazinesArray() {
        return this.getAllDocumentsOf('revista');
    }

    getBoxArray() {
        return this.getAllDocumentsOf('caixa');
    }

    getLoansArray() {
        return this.getAllDocumentsOf('emprestimos');
    }

    getNewBoxNumber(){
        return new Promise((resolve, reject) => {
            this.db.collection("caixa").get().then((querySnapshot) => {      
                resolve(querySnapshot.size + 1);
            });
        });
    }

    isEqualFriends(name, motherName){
        return new Promise((resolve, reject) => {
            this.db.collection("amiguinho")
                .where('nome_amiguinho', '==', name)
                .where('nome_mae', '==', motherName)
                .get()
                .then((querySnapshot) => {
                    let length = 0;
                    querySnapshot.forEach((doc) => {
                        length++;
                    });
                    resolve((length == 0) ? { 'exists': true } : { 'exists':  false});
                })
        });
    }

    isMaganizeBerrowed(docId){
        return new Promise((resolve, reject) => {
            this.db.collection('revista').where('')
        });
    }

    register_friend(...userData) {
        const [ name, motherName, motherPhone, address, birthday ] = userData;

        this.isEqualFriends(name, motherName).then(({exists}) => {
            if (exists) {
                this.db.collection("amiguinho").add({
                    'nome_amiguinho': name,
                    'nome_mae': motherName,
                    'telefone_mae': motherPhone,
                    'endereco': address,
                    'aniversario_amiguinho': Number.parseInt(birthday)
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    this.successFc();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    this.errorFc();
                });
            } else {
                console.log('ja existe');
                this.errorFc();
            }
        })
    }

    register_magazine(...magazineData){
        const [ name, collectionNumber, type, storedBoxNumber, storedBoxId ] = magazineData;

        this.db.collection("revista").add({
            'nome': name,
            'categoria': type,
            'numero_colecao': Number.parseInt(collectionNumber),
            'caixa': Number.parseInt(storedBoxNumber)
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            const ref = this.db.collection("caixa").doc(storedBoxId);
            const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

            ref.update({
                'revistas_guardadas': arrayUnion(docRef.id)
            })
            .then(() => {
                console.log('stored in box ' + storedBoxNumber);
            })
            .catch((error) => {
                console.log('error to update maganize into box');
                console.log(error);
            });
            this.successFc();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            this.errorFc();
        });
    }

    register_box(...boxData){
        const [ color, tags, number] = boxData;

        this.db.collection("caixa").add({
            'cor': color,
            'etiquetas': tags,
            'numero': Number.parseInt(number),
            'revistas_guardadas': []
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            this.successFc();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            this.errorFc();
        });
    }

    register_loan(...loanData){
        const [ friendId, magazineId, loanDate, returnDate ] = loanData;

        this.db.collection("emprestimos").add({
            'amiguinho': friendId,
            'revistas': [
                {
                'revista': magazineId,
                'data_emprestimo': loanDate,
                'data_devolucao': returnDate
                }
            ]
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            this.successFc();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            this.errorFc();
        });
    }

    
    update_friend(docId, ...userData) {
        const [ name, motherName, motherPhone, address, birthday ] = userData;

        this.isEqualFriends(name, motherName).then(({exists}) => {
            if (exists) {
                this.db.collection("amiguinho").doc(docId).update({
                    'nome_amiguinho': name,
                    'nome_mae': motherName,
                    'telefone_mae': motherPhone,
                    'endereco': address,
                    'aniversario_amiguinho': Number.parseInt(birthday)
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    this.successFc();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    this.errorFc();
                });
            } else {
                console.log('ja existe');
                this.errorFc();
            }
        })
    }

    update_magazine(docId, ...magazineData){
        const [ name, collectionNumber, type, storedBoxNumber, storedBoxId ] = magazineData;

        this.db.collection("revista").doc(docId).update({
            'nome': name,
            'categoria': type,
            'numero_colecao': Number.parseInt(collectionNumber),
            'caixa': Number.parseInt(storedBoxNumber)
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            const ref = this.db.collection("caixa").doc(storedBoxId);
            const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

            ref.update({
                'revistas_guardadas': arrayUnion(docRef.id)
            })
            .then(() => {
                console.log('stored in box ' + storedBoxNumber);
            })
            .catch((error) => {
                console.log('error to update maganize into box');
                console.log(error);
            });
            this.successFc();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            this.errorFc();
        });
    }

    update_box(docId, ...boxData){
        const [ color, tags, storedMagazines] = boxData;

        this.db.collection("caixa").doc(docId).update({
            'cor': color,
            'etiquetas': tags,
            'revistas_guardadas': storedMagazines
        })
        .then((docRef) => {
            console.log("Document updated");
            this.successFc();
        })
        .catch((error) => {
            console.error("Error updating document ", error);
            this.errorFc();
        });
    }

    update_loan(docId, ...loanData){
        const [ friendId, magazineId, loanDate, returnDate ] = loanData;

        this.db.collection("emprestimos").doc(docId).update({
            'amiguinho': friendId,
            'revistas': [
                {
                'revista': magazineId,
                'data_emprestimo': loanDate,
                'data_devolucao': returnDate
                }
            ]
        })
        .then((docRef) => {
            this.successFc();
        })
        .catch((error) => {
            this.errorFc();
        });
    }
    
    deleteDocument(collection, docId) {
        this.db.collection(collection).doc(docId).delete()
            .then(() => {
                this.successFc();
            })
            .catch((error) => {
                this.errorFc();
            });
    }

    deleteFriend(docId){
        this.deleteDocument('amiguinho', docId);
        this.db.collection('emprestimos').where("amiguinho", "==", docId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.db.collection('emprestimos').doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    deleteMagazine(docId){
        
        this.db.collection('emprestimos').where("amiguinho", "==", docId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.db.collection('emprestimos').doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    deleteLoan(docId){
        this.deleteDocument('emprestimos', docId);
    }

    deleteBox(docId){

    }

    /*
    update(docID, ...userData){
        const [ name, phone, origin, contact_date, note ] = userData;

        this.db.collection("agendamentos").doc(docID).update({
            name: name,
            phone: phone,
            origin: origin,
            contact_date: contact_date,
            note: note
        })
        .then(() => {
            console.log("Document successfully updated!");
            this.successFc();
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            this.errorFc();
        });
    }

    */

}