using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Hubs.Clients;
using UNIREALCHAIN_React.Models;

namespace UNIREALCHAIN_React.Hubs
{

    public class DataHub : Hub<IClient>
    {

        public async Task SendMessage(Data  data)
        {
            await Clients.All.ReceiveData(data);
        }
    }
}
