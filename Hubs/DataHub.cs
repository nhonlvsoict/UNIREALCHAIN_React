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
        private Dictionary<string, RealtimeValuesService>  _realtimeValuesService = new Dictionary<string, RealtimeValuesService>();
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
            _userConnectionManager.KeepUserConnection(symbol, Context.ConnectionId);
            if (!_realtimeValuesService.ContainsKey(symbol))
            {
                _realtimeValuesService[symbol] = new RealtimeValuesService(symbol);
            }
            return _realtimeValuesService[symbol].Observe()
                .ToNewestValueStream(Context.ConnectionAborted);
        }
        //Called when a connection with the hub is terminated.
        public async override Task OnDisconnectedAsync(Exception exception)
        {
            //get the connectionId
            var connectionId = Context.ConnectionId;
            _userConnectionManager.RemoveUserConnection(connectionId, out string unmonitorSymbol);
            if (unmonitorSymbol != "")
            {
                _realtimeValuesService.Remove(unmonitorSymbol);
            }
            var value = await Task.FromResult(0);
        }
    }
}