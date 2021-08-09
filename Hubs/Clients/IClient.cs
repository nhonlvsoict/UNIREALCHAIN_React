using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Models;

namespace UNIREALCHAIN_React.Hubs.Clients
{
    public interface IClient
        
    {
        Task ReceiveData(Data data);
    }
}
