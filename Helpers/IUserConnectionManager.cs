using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UNIREALCHAIN_React.Services;

namespace UNIREALCHAIN_React.Helpers
{
    public interface IUserConnectionManager
    {
        public Dictionary<string, RealtimeValuesService> RealtimeValuesService { get; }
        void KeepSymbolConnection(string symbol, string connectionId);
        void RemoveSymbolConnection(string connectionId);
        public void SymbolUnmornitor(string connectionId, string symbol);
    }
}
