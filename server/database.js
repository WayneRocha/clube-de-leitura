class Database {
    constructor() {
        this.db = firebase.firestore();
        this.successFc = () => { };
        this.errorFc = () => { };
    }

    setSuccessFc(callback) {
        this.successFc = callback;
    }

    setErrorFc(callback) {
        this.errorFc = callback;
    }

    getDocument(collection, docID) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).doc(docID)
                .get()
                .then((querySnapshot) => {
                    const client = querySnapshot.data();
                    resolve(client);
                })
                .catch((error) => {
                    console.error("Error geting document: ", error);
                });
        });
    }

    getAllDocumentsOf(collection) {
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
                        const document = { id: doc.id, ...doc.data() };
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

    getNewBoxNumber() {
        return new Promise((resolve, reject) => {
            this.db.collection("caixa").get().then((querySnapshot) => {
                resolve(querySnapshot.size + 1);
            });
        });
    }

    isEqualFriends(name, motherName) {
        return new Promise((resolve, reject) => {
            this.db.collection("amiguinho")
                .where('nome_amiguinho', '==', name)
                .where('nome_mae', '==', motherName)
                .get()
                .then((querySnapshot) => {
                    resolve({ 'exists': (querySnapshot.size == 0) });
                })
        });
    }

    isMaganizeBerrowed(docId) {
        return new Promise((resolve, reject) => {
            this.db.collection('emprestimos').where('revistas.revista', '==', docId)
                .get()
                .then((querySnapshot) => {
                    resolve(querySnapshot.size > 0);
                })
                .catch(() => {
                    reject(false);
                })
        });
    }

    register_friend(...userData) {
        return new Promise((resolve, reject) => {
            const [name, motherName, motherPhone, address, birthday] = userData;

            this.isEqualFriends(name, motherName).then(({ exists }) => {
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
                            resolve(1);
                            this.successFc();
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                            reject(undefined);
                            this.errorFc();
                        });
                } else {
                    console.log('ja existe');
                    reject(undefined);
                }
            });
        });
    }

    register_magazine(...magazineData) {
        return new Promise((resolve, reject) => {
            const [name, collectionNumber, type, storedBoxNumber, storedBoxId] = magazineData;

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
                            resolve(1);
                        })
                        .catch((error) => {
                            console.log('error to update maganize into box');
                            reject(undefined);
                        });
                    this.successFc();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    this.errorFc();
                });

        });
    }

    register_box(...boxData) {
        return new Promise((resolve, reject) => {
            const [color, tags, number] = boxData;
            this.db.collection("caixa").add({
                'cor': color,
                'etiquetas': tags,
                'numero': Number.parseInt(number),
                'revistas_guardadas': []
            })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    this.successFc();
                    resolve(1);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    reject(undefined);
                    this.errorFc();
                });
        });
    }

    register_loan(...loanData) {
        return new Promise((resolve, reject) => {
            const [friendId, magazineId, loanDate, returnDate] = loanData;

            this.db.collection("emprestimos").add({
                'amiguinho': friendId,
                'revistas': {
                    'revista': magazineId,
                    'data_emprestimo': loanDate,
                    'data_devolucao': returnDate
                }
            })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    resolve(1);
                    this.successFc();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    reject(undefined);
                    this.errorFc();
                });
        });
    }

    update_friend(docId, ...userData) {
        return new Promise((resolve, reject) => {
            const [name, motherName, motherPhone, address, birthday] = userData;
            this.db.collection("amiguinho").doc(docId).update({
                'nome_amiguinho': name,
                'nome_mae': motherName,
                'telefone_mae': motherPhone,
                'endereco': address,
                'aniversario_amiguinho': Number.parseInt(birthday)
            })
                .then(() => {
                    this.successFc();
                    resolve(1);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    reject();
                    this.errorFc();
                });
        });
    }

    update_magazine(docId, ...magazineData) {
        return new Promise((resolve, reject) => {
            const [name, collectionNumber, type] = magazineData;

            this.db.collection("revista").doc(docId).update({
                'nome': name,
                'categoria': type,
                'numero_colecao': Number.parseInt(collectionNumber),
            })
                .then(() => {
                    resolve(1);
                    this.successFc();
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    this.errorFc();
                    reject
                });
        });
    }

    update_box(docId, ...boxData) {
        return new Promise((resolve, reject) => {
            const [color, tags] = boxData;

            this.db.collection("caixa").doc(docId).update({
                'cor': color,
                'etiquetas': tags,
            })
                .then(() => {
                    console.log("Document updated");
                    this.successFc();
                    resolve(true);
                })
                .catch((error) => {
                    console.error("Error updating document ", error);
                    this.errorFc();
                    reject();
                });
        });
    }

    update_loan(docId, ...loanData) {
        return new Promise((resolve, reject) => {
            const [friendId, magazineId, loanDate, returnDate] = loanData;

            this.db.collection("emprestimos").doc(docId).update({
                'amiguinho': friendId,
                'revistas': {
                    'revista': magazineId,
                    'data_emprestimo': loanDate,
                    'data_devolucao': returnDate
                }
            })
                .then((docRef) => {
                    resolve(1);
                    this.successFc();
                })
                .catch((error) => {
                    reject();
                    this.errorFc();
                });
        });
    }

    deleteDocument(collection, docId) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).doc(docId).delete()
                .then(() => {
                    resolve(true);
                    this.successFc();
                })
                .catch((error) => {
                    reject(false);
                    this.errorFc();
                });
        });
    }

    deleteFriend(docId) {
        return new Promise((resolve, reject) => {
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
                    this.deleteDocument('amiguinho', docId);
                    resolve(docId);
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                    reject();
                });
        });
    }

    deleteMagazine(docId) {
        return new Promise(async (resolve, reject) => {
            const isBerrowed = await this.isMaganizeBerrowed(docId);
            if (!isBerrowed) {
                this.db.collection('revista').doc(docId).delete()
                    .then(() => {
                        resolve(true);
                        console.log('success to delete');
                    })
                    .catch((error) => {
                        reject();
                        console.log("Error to delete: ", error);
                    });
            } else {
                console.log('revista esta emprestada');
            }
        });
    }

    deleteLoan(docId) {
        return new Promise(async (resolve, reject) => {
            const success = await this.deleteDocument('emprestimos', docId);
            resolve(success);
        });
    }

    deleteBox(docId) {
        return new Promise(async (resolve, reject) => {
            const storedMagazines = await this.db.collection('caixa').doc(docId)
                .get()
                .then((querySnapshot) => {
                    return (querySnapshot.data()).revistas_guardadas;
                })
                .catch(error => {
                    console.log(error);
                })
            if (storedMagazines) {
                storedMagazines.forEach(magazineId => {
                    this.db.collection('revista').doc(magazineId).delete()
                        .then(() => {
                            console.log('success to delete');
                        })
                        .catch((error) => {
                            console.log("Error to delete: ", error);
                        });
                });
                this.db.collection('caixa').doc(docId).delete();
                resolve(1);
            }
            reject(0);
        });
    }
}