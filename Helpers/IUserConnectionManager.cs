using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UNIREALCHAIN_React.Helpers
{
    public interface IUserConnectionManager
    {
        void KeepUserConnection(string symbol, string connectionId);
        void RemoveUserConnection(string connectionId, out string unmonitorSymbol);
        List<string> GetUserConnections(string symbol);
    }
}
