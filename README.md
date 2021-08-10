Technology Stack:
+ Backend: dotNet Core 3.1 with SignalR
+ Frontend: React 

This wep appication is used to aqquire data from Binance API endpoint. Some of the main feature:
- User can select between 6 coin symbol to aqquire data
- The backend will keeptrack of each user that are streammed data from server. When user change the coin or disconnect, the backend will terminate the data aqquisition from API to save quota and prevent limit exceed.
- If there is many user request to aqquire data from the same coin symbol, the backend will create only one thread to aqquire data from API and redistribute to users. This one will also for API quota saving. 
