using Microsoft.AspNetCore.SignalR;
using RxSignalrStreams.Extensions;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Helpers;
using UNIREALCHAIN_React.Models;
using UNIREALCHAIN_React.Services;

namespace UNIREALCHAIN_React.Hubs
{
    public static class ObservableExtensions
    {
    }

    public class DataHub : Hub
    {
        
        private readonly IUserConnectionManager _userConnectionManager;

        public DataHub(IUserConnectionManager userConnectionManager)
        {
            _userConnectionManager = userConnectionManager;
        }

        public ChannelReader<FinancialData> RealtimeData(
            String symbol,
            CancellationToken cancellationToken
           )
        {
            try
            {
                string connectionId = Context.ConnectionId;
                _userConnectionManager.KeepSymbolConnection(symbol, connectionId);
                if (!_userConnectionManager.RealtimeValuesService.ContainsKey(symbol))
                {
                    _userConnectionManager.RealtimeValuesService[symbol] = new RealtimeValuesService(symbol, cancellationToken);
                }
                cancellationToken.Register((dynamic obj) =>
                {
                    //get the connectionId
                    _userConnectionManager.SymbolUnmornitor(obj.connectionId, obj.symbol);
                }, new { symbol, connectionId });
               
                return _userConnectionManager.RealtimeValuesService[symbol].Observe()
                    .ToBufferedStream(cancellationToken);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        //Called when a connection with the hub is terminated.
        public async override Task OnDisconnectedAsync(Exception exception)
        {
            //get the connectionId
            var connectionId = Context.ConnectionId;
            _userConnectionManager.RemoveSymbolConnection(connectionId);
           
            var value = await Task.FromResult(0);
        }
    }
}