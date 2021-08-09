import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const DataVisualize = () => {
    const [ connection, setConnection ] = useState(null);
    const [ data, setData ] = useState([]);
    const latestData = useRef(null);

    latestData.current = data;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44320/hubs/data')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
    
                    connection.on('ReceiveData', message => {
                        const updatedData = [...latestData.current];
                        updatedData.push(message);
                    
                        setData(updatedData);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async (user, message) => {
        const chatMessage = {
            Name: user,
            Price: message
        };

        if (connection.connectionStarted) {
            try {
                await connection.send('SendMessage', chatMessage);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }
    

    return (
        <div>
            <div>
                <button onClick={() => sendMessage("nhon", "dz")}>
                    Testtt
                </button>
            </div>
            {/* {data} */}
        </div>
    );
}
export default DataVisualize