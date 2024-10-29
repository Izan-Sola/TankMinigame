function sendDatabaseUpdate(score, coins, action, name) {
    fetch('https://monthly-devoted-pug.ngrok-free.app/databaseupdates', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // score: score,
            // coins: coins,
            // action: action,
            // name: name
        })
    })

        .then(response => response.json())
        .then(data => {
            if (action == "updateScoreList") {

                data.scores.forEach(rows => {


                })

            }

            else {
                console.log('Response from server:', data);
            }
        })
        .catch(error => {
            console.error('Error in database operation:', error);
        });
}