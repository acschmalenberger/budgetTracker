//(database name, store name, method, object) bellow
const request = window.indexedDB.open("budget", 1);

// export function useIndexedDB(){
//     return new Promise ((resolve, reject)=>{
        let db;
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            db.createObjectStore("pending", {
                keyPath: "transactionId",
                autoIncrement: true
            });
        };

        request.onsuccess = function(event){
            db = event.target.result;

            checkDatabase();
        }

        request.onerror = function(event) {
            console.log(event.target.errorCode);
        };

        function saveRecord (record){
            const transaction = db.transaction(["pending"], "readwrite");
            const budgetStore = transaction.objectStore("pending");

            budgetStore.add(record);
        }

        function checkDatabase(){
            const transaction = db.transaction(["pending"], "readwrite");
            const budgetStore = transaction.objectStore("pending");
            const getAll = budgetStore.getAll();
            
            getAll.onsuccess = function (event){
                fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                      Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {    
                    return response.json();
                })
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const budgetStore = transaction.objectStore("pending");
                    budgetStore.clear()
                })
            }
        }
        // window.addEventListener("online", checkDatabase);
        // window.addEventListener("offline", browserOffline);




