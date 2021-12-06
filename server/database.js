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
    /*
    getClient(docID){
        return new Promise((resolve, reject) => {
            this.db.collection('agendamentos').doc(docID)
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

    getClientsArray() {
        return new Promise((resolve, reject) => {
            const clients = [];
            this.db.collection("agendamentos").orderBy("name").limit(20)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const client = {id: doc.id, ...doc.data()};
                        clients.push(client);
                    });
                    resolve(clients);
                })
                .catch((error) => {
                    reject([]);
                });
        });
    }

    deleteClient(docID) {
        this.db.collection('agendamentos').doc(docID).delete()
            .then(() => {
                this.successFc();
            })
            .catch((error) => {
                this.errorFc();
            });
    }



    */
    register_friend(...userData) {
        const [ name, motherName, motherPhone, address, birthday ] = userData;
        const isEqualRegister = () => {
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
        };

        isEqualRegister().then(({exists}) => {
            if (exists) {
                this.db.collection("amiguinho").add({
                    'nome_amiguinho': name,
                    'nome_mae': motherName,
                    'telefone_mae': motherPhone,
                    'endereco': address,
                    'aniversario_amiguinho': birthday
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
            }
        })
    }

    register_magazine(...magazineData){
        const [ name, collectionNumber, type, storedAtBox ] = magazineData;

        this.db.collection("revista").add({
            'nome': name,
            'categoria': type,
            'numero_colecao': collectionNumber,
            'caixa': storedAtBox,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            const ref = this.db.collection("caixa").where('numero', '==', storedAtBox);

            ref.set({
                'revistas_guardadas': this.db.FieldValue.arrayUnion(docRef.id)
            }, { merge: true })
            .then(() => {
                console.log("stored at box ", storedAtBox);
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